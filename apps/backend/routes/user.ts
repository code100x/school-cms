import { Router } from "express";
import { prismaClient } from "db/client";
import jwt from "jsonwebtoken";
import { SendSchema, SignupSchema } from "common/inputs";
import { authMiddleware } from "../middleware";
import { cli, MPC_SERVERS, MPC_THRESHOLD } from "./admin";
import axios from "axios";
import { NETWORK } from "common/solana";
import bcrypt from "bcrypt"

const router = Router();

export default router;

router.post("/signin", async (req, res) => {
    const {success, data} = SignupSchema.safeParse(req.body);
    if (!success) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const email = data.email;
    const password = data.password;

    const user = await prismaClient.user.findFirst({
        where: {
            email
        }
    });

    if (!user) {
        res.status(403).json({
            message: "User not found"
        })
        return;
    }

    // TODO: Add password hashing
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        res.status(403).json({
            message: "Incorrect creds"
        })
        return;

    }

    const token = jwt.sign({
        userId: user.id
    }, process.env.JWT_SECRET!);

    res.json({
        token
    })    
});

router.get("/calendar/:courseId", authMiddleware, async (req, res) => {
    const courseId = req.params.courseId;

    const course = await prismaClient.course.findFirst({
        where: {
            id: courseId
        }
    })

    const purchase = await prismaClient.purchases.findFirst({
        where: {
            userId: req.userId,
            courseId: courseId
        }
    })

    if (!purchase) {
        res.status(411).json({
            message: "You dont have access to the course"
        })
        return
    }

    if (!course) {
        res.status(411).json({
            message: "Course with id not found"
        })
        return
    }

    res.json({
        id: course.id,
        calendarId: course.calendarNotionId
    })

})

router.get("/courses", authMiddleware, async(req, res) => {
    const courses = await prismaClient.course.findMany({
        where: {
            purchases: {
                some: {
                    userId: req.userId
                }
            }
        }
    });

    res.json({
        courses: courses.map(c => ({
            id: c.id,
            title: c.title,
            slug: c.slug
        }))
    })
})


router.post("/send", authMiddleware, async (req, res) => {
    const {success, data} = SendSchema.safeParse(req.body);
    const blockhash = await cli.recentBlockHash();
    if (!success) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {id: req.userId}
    });

    if (!user) {
        res.status(403).json({
            message: "User not found"
        })
        return;
    }

    const step1Responses = await Promise.all(MPC_SERVERS.map(async (server) => {
        try {
        const response = await axios.post(`${server}/send/step-1`, {
                to: data.to,
                amount: data.amount,
                userId: req.userId,
                recentBlockhash: blockhash
            })
            return response.data.response;
        } catch (e) {
            console.error(e);
            return null;
        }
    }))

    console.log(step1Responses);

    const step2Responses = await Promise.all(MPC_SERVERS.map(async (server, index) => {
        console.log({
            to: data.to,
            amount: data.amount,
            userId: req.userId,
            recentBlockhash: blockhash,
            step1Response: step1Responses[index],
            allPublicNonces: JSON.stringify(step1Responses.map((r) => r.publicNonce))
        })
        const response = await axios.post(`${server}/send/step-2`, {
            to: data.to,
            amount: data.amount,
            userId: req.userId,
            recentBlockhash: blockhash,
            step1Response: JSON.stringify(step1Responses[index]),
            allPublicNonces: step1Responses.map((r) => r.publicNonce)
        })
        return response.data;
    }))

    console.log(step2Responses);

    const partialSignatures = step2Responses.map((r) => r.response);

    const transactionDetails = {
        amount: data.amount,
        to: data.to,
        from: user.publicKey,
        network: NETWORK,
        memo: undefined,
        recentBlockhash: blockhash
      };
      
      const signature = await cli.aggregateSignaturesAndBroadcast(
        JSON.stringify(partialSignatures),
        JSON.stringify(transactionDetails),
        JSON.stringify({
            aggregatedPublicKey: user.publicKey,
            participantKeys: step2Responses.map((r) => r.publicKey),
            threshold: MPC_THRESHOLD
        })
      );

      res.json({
        signature
      })   
})
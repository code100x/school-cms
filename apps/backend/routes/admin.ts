import { Router } from "express";
import { TSSCli } from 'solana-mpc-tss-lib/mpc';
import axios from "axios";
import { prismaClient } from "db/client";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SendSchema, SignupSchema } from "common/inputs";
import { adminAuthMiddleware } from "../middleware";
import { NETWORK } from "common/solana";
import bcrypt from "bcrypt";

export const MPC_SERVERS = [
    "http://localhost:3001",
    "http://localhost:3002",
    // "http://localhost:3003",
];

export const MPC_THRESHOLD = Math.max(1, MPC_SERVERS.length - 1);

export const cli = new TSSCli(NETWORK);

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(403).json({
            message: "Incorrect creds"
        })
        return;

    }

    const token = jwt.sign({
        userId: user.id
    }, process.env.ADMIN_JWT_SECRET!);

    res.json({
        token
    })    
});


router.post("/create-user", adminAuthMiddleware, async (req, res) => {
    const {success, data} = CreateUserSchema.safeParse(req.body);
    if (!success) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const user = await prismaClient.user.create({
        data: {
            email: data.email,
            password: data.password,
            phone: data.phone,
            role: "USER"
        }
    })

    const responses = await Promise.all(MPC_SERVERS.map(async (server) => {
        const response = await axios.post(`${server}/create-user`, {
            userId: user.id
        })
        return response.data;
    }))
    console.log(responses);

    const aggregatedPublicKey = cli.aggregateKeys(responses.map((r) => r.publicKey), MPC_THRESHOLD);
    console.log(aggregatedPublicKey);

    await prismaClient.user.update({
        where: {id: user.id},
        data: {
            publicKey: aggregatedPublicKey.aggregatedPublicKey
        }
    })

    await cli.airdrop(aggregatedPublicKey.aggregatedPublicKey, 0.1);

    res.json({
        message: "User created",
        user: {
            ...user,
            publicKey: aggregatedPublicKey.aggregatedPublicKey
        }
    })
})

import express from "express";
import { prismaClient } from "mpc-db/client";
import { TSSCli } from 'solana-mpc-tss-lib/mpc';
import { NETWORK } from "common/solana";

const cli = new TSSCli(NETWORK);

const app = express();
app.use(express.json());

app.post("/create-user", async (req, res) => {
    const {userId} = req.body;
    const participant = await cli.generate();
    console.log(participant);
    await prismaClient.keyShare.create({
        data: {
            userId,
            publicKey: participant.publicKey,
            secretKey: participant.secretKey
        }
    })

    res.json({
        publicKey: participant.publicKey,
    })
})

app.post("/send/step-1", async (req, res) => {
    const {to, amount, userId, recentBlockhash} = req.body;
    console.log(req.body);
    console.log(userId);
    const user = await prismaClient.keyShare.findFirst({
        where: {userId}
    })
    if (!user) {
        res.status(403).json({
            message: "User not found"
        })
        return
    }

    const response = await cli.aggregateSignStepOne(
        user.secretKey,
        to,
        amount,
        undefined, // Optional memo
        recentBlockhash
    );

    res.json({
        response
    })
})

app.post("/send/step-2", async (req, res) => {
    const {to, amount, userId, recentBlockhash, step1Response, allPublicNonces} = req.body;
    console.log(req.body);
    console.log(req.body)
    console.log(userId);
    const user = await prismaClient.keyShare.findFirst({
        where: {userId}
    })

    if (!user) {
        res.status(403).json({
            message: "User not found"
        })
        return
    }
    
    console.log(step1Response);

    const response = await cli.aggregateSignStepTwo(
        step1Response,
        user.secretKey,
        to,
        amount,
        allPublicNonces,
        undefined,
        recentBlockhash
    );

    res.json({
        response,
        publicKey: user.publicKey
    })
})

app.listen(3002);
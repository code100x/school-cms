import express from "express";
import cors from "cors";
import { prismaClient } from "db/client";
import { authMiddleware } from "./middleware";

const app = express()

app.post("/signin", (req, res) => {

});

app.get("/calendar", authMiddleware, (req, res) => {

})

app.use(cors())

app.listen(process.env.PORT || 3000);
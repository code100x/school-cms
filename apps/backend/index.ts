import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";

const app = express()
app.use(cors())
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter)

app.listen(process.env.PORT || 3000);


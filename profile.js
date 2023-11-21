import express, { json } from "express";

import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./api/user.js";
import connectDB from "./config/db.js";
connectDB();
const app = express();
app.use(json());
app.use("/user", UserRouter);
const port = 8000;
app.listen(process.env.PORT, () => {
  console.log(`Running at ${process.env.port}........`);
});

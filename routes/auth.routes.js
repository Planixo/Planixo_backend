import express from "express";
import { signup } from "../controllers/auth.controller.js";

const app = express.Router();

app.post("/signup", signup);

export default app;
import express from "express";
import { register, login } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

// POST /api/auth/register - реєстрація
authRouter.post("/register", validateBody(registerSchema), register);

// POST /api/auth/login - логін
authRouter.post("/login", validateBody(loginSchema), login);

export default authRouter; 
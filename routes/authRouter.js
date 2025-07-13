import express from "express";
import { register, login, logout, current, updateAvatar } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

// POST /api/auth/register - реєстрація
authRouter.post("/register", validateBody(registerSchema), register);

// POST /api/auth/login - логін
authRouter.post("/login", validateBody(loginSchema), login);

// POST /api/auth/logout - логаут (потребує аутентифікації)
authRouter.post("/logout", authenticate, logout);

// GET /api/auth/current - отримання даних поточного користувача (потребує аутентифікації)
authRouter.get("/current", authenticate, current);

// PATCH /api/auth/avatars - оновлення аватара користувача (потребує аутентифікації)
authRouter.patch("/avatars", authenticate, upload.single('avatar'), updateAvatar);

export default authRouter; 
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router
    .route("/register")
    .post(registerUser)
    .get((_req, res) => {
        res.status(405).json({
            success: false,
            message: "Use POST with a JSON body to register.",
            hint: "POST /register or POST /api/v1/users/register"
        });
    });

export default router; // This fixes the 'default export' error
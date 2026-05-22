import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";    
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, (req, res) => {
    // Because verifyJWT ran first, we instantly have access to req.user!
    return res.status(200).json({
        success: true,
        message: `Goodbye, ${req.user.name}! Securely logged out.`
    });
});

export default router;
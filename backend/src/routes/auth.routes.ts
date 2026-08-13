import { Router } from "express";
import { checkNumber, whatsappStatus, sendOtp, verifyOtp } from "../controllers/auth.controller";

/**
 * Shared auth routes — login/signup/OTP.
 * Edit carefully: every role depends on this.
 */
const router = Router();

router.post("/check-number", checkNumber);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/whatsapp-status", whatsappStatus);

export default router;
export { router as authRouter };
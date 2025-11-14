import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getAdminConfig,
  forgotPassword,
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/config", getAdminConfig);

export default router;
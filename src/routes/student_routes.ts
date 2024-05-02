import express, { Router, Request, Response } from 'express';
import { StudentController } from '../controllers/student/student_auth_controllers';
import authenticateToken from '../middlewares/auth_middlewares';
import passport from 'passport'

const router: Router = express.Router();

router.post('/signup', StudentController.registerStudent);
router.post('/signup/verify-otp', StudentController.verifyOtp);
router.post('/signup/resend-otp', StudentController.resendOtp);
router.post('/login', StudentController.login);
router.post('/test', authenticateToken, StudentController.test);


export const studentRoute = router;
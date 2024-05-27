import express, { Router, Request, Response } from 'express';
import { StudentController } from '../controllers/student/student_auth_controllers';
import authenticateToken from '../middlewares/student_auth_middleware';
import passport from 'passport'
import authenticateStudentToken from '../middlewares/student_auth_middleware';
import { StudentHomeController } from '../controllers/student/student_home_controllers';

const router: Router = express.Router();

router.post('/signup', StudentController.registerStudent);
router.post('/signup/verify-otp', StudentController.verifyOtp);
router.post('/signup/resend-otp', StudentController.resendOtp);
router.post('/login', StudentController.login);
router.post('/test', authenticateToken, StudentController.test);
router.get('/getcourses', StudentHomeController.getCourses);
router.post('/search', StudentHomeController.search);


export const studentRoute = router;
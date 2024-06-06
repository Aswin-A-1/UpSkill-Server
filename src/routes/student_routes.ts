import express, { Router, Request, Response } from 'express';
import { StudentController } from '../controllers/student/student_auth_controllers';
import authenticateToken from '../middlewares/student_auth_middleware';
import passport from 'passport'
import authenticateStudentToken from '../middlewares/student_auth_middleware';
import { StudentHomeController } from '../controllers/student/student_home_controllers';
import { StudentPaymentController } from '../controllers/student/student_payment_controllers';

const router: Router = express.Router();

router.post('/signup', StudentController.registerStudent);
router.post('/signup/verify-otp', StudentController.verifyOtp);
router.post('/signup/resend-otp', StudentController.resendOtp);
router.post('/login', StudentController.login);
router.post('/test', authenticateToken, StudentController.test);
router.get('/getcourses', StudentHomeController.getCourses);
router.post('/getcourse', StudentHomeController.getCourse);
router.post('/getmycourse', StudentHomeController.getMyCourse);
router.post('/isenrolled', StudentHomeController.isEnrolled);
router.post('/courseenroll', StudentHomeController.courseEnroll);
router.post('/search', StudentHomeController.search);
router.post('/create-payment-intent', StudentPaymentController.initPayment);


export const studentRoute = router;
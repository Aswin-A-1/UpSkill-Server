import express, { Router, Request, Response } from 'express';
import { StudentController } from '../controllers/student/student_auth_controllers';
import authenticateToken from '../middlewares/student_auth_middleware';
import passport from 'passport'
import authenticateStudentToken from '../middlewares/student_auth_middleware';
import { StudentHomeController } from '../controllers/student/student_home_controllers';
import { StudentPaymentController } from '../controllers/student/student_payment_controllers';
import { ResponseStatus } from '../types/ResponseStatus';

const router: Router = express.Router();

router.post('/signup', StudentController.registerStudent);
router.post('/signup/verify-otp', StudentController.verifyOtp);
router.post('/signup/resend-otp', StudentController.resendOtp);
router.post('/login', StudentController.login);
router.post('/test', authenticateToken, StudentController.test);
router.post('/refresh-token', StudentController.refreshToken);
router.get('/getcourses', authenticateStudentToken, StudentHomeController.getCourses);
router.get('/getcoursesoutside', StudentHomeController.getCourses);
router.post('/getcourse', StudentHomeController.getCourse);
router.post('/getmycourse', StudentHomeController.getMyCourse);
router.post('/isenrolled', StudentHomeController.isEnrolled);
router.post('/iscompleted', StudentHomeController.isCompleted);
router.post('/changecompletion', StudentHomeController.changeCompletionStatus);
router.post('/courseenroll', StudentHomeController.courseEnroll);
router.post('/search', StudentHomeController.search);
router.post('/getmessages', StudentHomeController.getMessages);
router.post('/create-payment-intent', StudentPaymentController.initPayment);
router.get('/getprofile/:studentid', authenticateStudentToken, StudentController.getStudentProfile);

router.get('/sample', (req: Request, res: Response) => {
    res.status(ResponseStatus.OK).json({ message: 'Hello' });
})

export const studentRoute = router;
import express, { Router, Request, Response } from 'express';
import { InstructorController } from '../controllers/instructor/instructor_auth_controllers';

const router: Router = express.Router();

router.post('/signup', InstructorController.registerInstructor);
router.post('/signup/verify-otp', InstructorController.verifyOtp);
router.post('/login', InstructorController.instructorlogin);


export const instructorRoute = router;
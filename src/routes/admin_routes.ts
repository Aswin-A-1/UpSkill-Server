import express, { Router, Request, Response } from 'express';
import { AdminStudentController } from '../controllers/admin/student_controllers';
import { AdminAuthController } from '../controllers/admin/admin_auth_controllers';

const router: Router = express.Router();

router.get('/getStudent', AdminStudentController.getStudents);
router.get('/getInstructors', AdminStudentController.getInstructors);
router.post('/login', AdminAuthController.adminlogin)
router.put('/manageStudent/:id', AdminStudentController.manageStudent)


export const adminRoute = router;
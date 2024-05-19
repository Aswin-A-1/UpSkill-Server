import express, { Router, Request, Response } from 'express';
import { AdminStudentController } from '../controllers/admin/student_controllers';
import { AdminAuthController } from '../controllers/admin/admin_auth_controllers';
import authenticateAdminToken from '../middlewares/admin_auth_middleware';

const router: Router = express.Router();

router.get('/getStudent', authenticateAdminToken, AdminStudentController.getStudents);
router.get('/getInstructors', authenticateAdminToken, AdminStudentController.getInstructors);
router.post('/login', AdminAuthController.adminlogin)
router.put('/manageStudent/:id', AdminStudentController.manageStudent)


export const adminRoute = router;
import express, { Router, Request, Response } from 'express';
import { AdminStudentController } from '../controllers/admin/student_controllers';
import { AdminAuthController } from '../controllers/admin/admin_auth_controllers';
import authenticateAdminToken from '../middlewares/admin_auth_middleware';
import { InstructorProfileController } from '../controllers/instructor/instructor_profile_controllers';

const router: Router = express.Router();

router.get('/getStudent', authenticateAdminToken, AdminStudentController.getStudents);
router.get('/getInstructors', authenticateAdminToken, AdminStudentController.getInstructors);
router.get('/getCourses', authenticateAdminToken, AdminStudentController.getCourses);
router.post('/login', AdminAuthController.adminlogin)
router.put('/manageStudent/:id', AdminStudentController.manageStudent)
router.post('/updateBlock', authenticateAdminToken, InstructorProfileController.updateBlock);


export const adminRoute = router;
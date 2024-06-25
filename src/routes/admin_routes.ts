import express, { Router, Request, Response } from 'express';
import { AdminStudentController } from '../controllers/admin/student_controllers';
import { AdminAuthController } from '../controllers/admin/admin_auth_controllers';
import authenticateAdminToken from '../middlewares/admin_auth_middleware';
import { InstructorProfileController } from '../controllers/instructor/instructor_profile_controllers';
import { InstructorCourseController } from '../controllers/instructor/instructor_course_controller';
import { AdminCourseController } from '../controllers/admin/admin_course_controllers';

const router: Router = express.Router();

router.get('/getStudent', authenticateAdminToken, AdminStudentController.getStudents);
router.get('/getInstructors', authenticateAdminToken, AdminStudentController.getInstructors);
router.get('/getCourses', authenticateAdminToken, AdminStudentController.getCourses);
router.get('/getCategory', authenticateAdminToken, InstructorCourseController.getCategory);
router.post('/addcategory', authenticateAdminToken, InstructorCourseController.addCategory);
router.delete('/deletecategory', authenticateAdminToken, InstructorCourseController.deleteCategory);
router.post('/login', AdminAuthController.adminlogin)
router.put('/manageStudent/:id', authenticateAdminToken, AdminStudentController.manageStudent)
router.post('/updateBlock', authenticateAdminToken, InstructorProfileController.updateBlock);
router.get('/getdashboarddata', authenticateAdminToken, AdminCourseController.getDashboardData);


export const adminRoute = router;
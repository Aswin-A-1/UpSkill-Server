import express, { Router, Request, Response } from 'express';
import { AdminStudentController } from '../controllers/admin/student_controllers';

const router: Router = express.Router();

router.get('/getStudent', AdminStudentController.getStudents);
router.put('/manageStudent/:id', AdminStudentController.manageStudent)


export const adminRoute = router;
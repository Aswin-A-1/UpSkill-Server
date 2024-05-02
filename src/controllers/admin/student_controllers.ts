import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';


export const AdminStudentController = {

    // getStudentDetails
    getStudents: asyncHandler(async (req: Request, res: Response) => {
        try {
            const students = await Student.find({ role: 'Student' });
            res.status(200).json({ message: 'Succesfully fetched data', students });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching student data.' });
        }
    }),

    // getStudentDetails
    manageStudent: asyncHandler(async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const student = await Student.findById(id)
            if (!student) {
                res.status(500).json({ error: 'No student found.' });
            } else {
                student.isBlocked = !student.isBlocked
                await student.save()
                const students = await Student.find({ role: 'Student' })
                res.status(200).json({ message: 'Updated succesfully', students });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching student data.' });
        }
    }),
};

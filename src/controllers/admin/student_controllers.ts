import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import { Instructor } from '../../models/instructor_model';
import { ResponseStatus } from '../../types/ResponseStatus';

// student controllers


export const AdminStudentController = {

    // getStudentDetails
    getStudents: asyncHandler(async (req: Request, res: Response) => {
        try {
            const students = await Student.find({ role: 'Student' });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', students });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching student data.' });
        }
    }),

    // getStudentDetails
    getInstructors: asyncHandler(async (req: Request, res: Response) => {
        try {
            const instructors = await Instructor.find();
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', instructors });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching student data.' });
        }
    }),

    // getStudentDetails
    manageStudent: asyncHandler(async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const student = await Student.findById(id)
            if (!student) {
                res.status(ResponseStatus.InternalServerError).json({ error: 'No student found.' });
            } else {
                student.isBlocked = !student.isBlocked
                await student.save()
                const updatedStudent = await Student.findById(id)
                res.status(ResponseStatus.OK).json({ message: 'Updated succesfully', updatedStudent });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching student data.' });
        }
    }),
};

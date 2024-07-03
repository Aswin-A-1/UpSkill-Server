import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import { Instructor } from '../../models/instructor_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';

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

    // getStudentDetailsList
    getStudentsList: asyncHandler(async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10);
            const limit = parseInt(req.query.limit as string, 10);
            const skip = (page - 1) * limit;
            const students = await Student.find({ role: 'Student' }).skip(skip).limit(limit);
            const totalcount = await Student.find({ role: 'Student' }).countDocuments();
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', students, totalcount });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching student data.' });
        }
    }),

    // getInstructorDetails
    getInstructors: asyncHandler(async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10);
            const limit = parseInt(req.query.limit as string, 10);
            const skip = (page - 1) * limit;
            const instructors = await Instructor.find().skip(skip).limit(limit);
            const totalcount = await Instructor.find().countDocuments()
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', instructors, totalcount });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching instructor data.' });
        }
    }),

    // getCoureseDetails
    getCourses: asyncHandler(async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10);
            const limit = parseInt(req.query.limit as string, 10);
            const skip = (page - 1) * limit;
            const courses = await Course.find().skip(skip).limit(limit);
            const totalcount = await Course.find().countDocuments();
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses, totalcount });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching course data.' });
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

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import { Instructor } from '../../models/instructor_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';


export const StudentHomeController = {

    // getCourses
    getCourses: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courses = await Course.find();
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),
};

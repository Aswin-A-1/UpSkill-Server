import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';
import { Section } from '../../models/section_model';
import { Instructor } from '../../models/instructor_model';


export const StudentHomeController = {

    // getCourses
    getCourses: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courses = await Course.find({ isActive: true });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // getCourse
    getCourse: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courseId = req.body.courseId
            const course = await Course.findById(courseId);
            const instructor = await Instructor.findById(course?.instructorid)
            const sections = await Section.find({ courseid: courseId });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', course, sections, instructor: instructor?.username });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // search
    search: asyncHandler(async (req: Request, res: Response) => {
        try {
            const query = req.body.query
            const courses = await Course.find({ coursename: { $regex: query, $options: 'i' }, isActive: true });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),
};

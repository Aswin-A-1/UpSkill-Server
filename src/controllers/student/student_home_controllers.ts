import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';
import { Section } from '../../models/section_model';
import { Instructor } from '../../models/instructor_model';
import { Enrollment } from '../../models/enrollment_model';
import { Message } from '../../models/message_model';


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

    // getMyCourse
    getMyCourse: asyncHandler(async (req: Request, res: Response) => {
        try {
            const userId = req.body.userId
            const enrollments = await Enrollment.find({ studentid: userId });
            const courseIds = enrollments.map(enrollment => enrollment.courseid);
            const courses = await Course.find({ _id: { $in: courseIds } });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // isEnrolled
    isEnrolled: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { courseId, studentId } = req.body
            const course = await Enrollment.findOne({ courseid: courseId, studentid: studentId });
            if (course) {
                res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', isEnrolled: true });
            } else {
                res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', isEnrolled: false });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // courseEnroll
    courseEnroll: asyncHandler(async (req: Request, res: Response) => {
        try {
            const newEnrollment = new Enrollment({
                paymentid: req.body.paymentId,
                amount: req.body.amount,
                studentid: req.body.userId,
                courseid: req.body.courseId,
            });
            const student = await Student.findById(req.body.userId)

            await newEnrollment.save();
            res.status(ResponseStatus.OK).json({ message: 'Succesfully enrolled' });
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

    // getMessages
    getMessages: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { studentId, instructorId } = req.body
            const messages = await Message.find({
                $or: [
                    { senderId: studentId, receiverId: instructorId },
                    { senderId: instructorId, receiverId: studentId }
                ]
            }).sort({ timestamp: 1 });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched messages', messages });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),
};

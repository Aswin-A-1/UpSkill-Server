import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Instructor } from '../../models/instructor_model';
import { Course } from '../../models/course_model';
import { Section } from '../../models/section_model';


export const InstructorCourseController = {

    // Add course details
    addcoursedetails: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { courseName, courseDescription, courseCategory, coursePrice, instructorId } = req.body;
            const thumbnailImage = req.file?.filename;
            const newCourse = new Course({
                coursename: courseName,
                description: courseDescription,
                category: courseCategory,
                price: coursePrice,
                thumbnailimage: thumbnailImage,
                instructorid: instructorId
            });
            await newCourse.save();
            const courseId = newCourse._id;
            res.status(200).json({ message: 'Course created, add sections', courseId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }),

    // Add section
    addsection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { title, description, lessons } = req.body.section;
            const courseId = req.body.courseId
            const newSection = new Section({
                sectionname: title,
                description: description,
                lessons: lessons,
                courseid: courseId,
            });
            await newSection.save();
            const sectionId = newSection._id;
            res.status(200).json({ message: 'Section saved', newSection });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }),

    // getCourseDetails
    getCourse: asyncHandler(async (req: Request, res: Response) => {
        try {
            const instructorid = req.params.instructorid
            const courses = await Course.find({ instructorid: instructorid });
            res.status(200).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching course data.' });
        }
    }),

    // getSection
    getSection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courseid = req.params.courseid
            const sections = await Section.find({ courseid: courseid });
            res.status(200).json({ message: 'Succesfully fetched data', sections });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching section data.' });
        }
    }),

}
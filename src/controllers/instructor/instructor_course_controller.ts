import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Instructor } from '../../models/instructor_model';
import { Course } from '../../models/course_model';
import { Section } from '../../models/section_model';
import { uploadS3Video } from '../../utils/s3uploader';


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
            const { title, description, lessons } = JSON.parse(req.body.section);
            const courseId = req.body.courseId
            const videos = req.files as Express.Multer.File[];
            // console.log('video files recived in controller: ', videos)
            // console.log('length: ', req.files?.length)
            console.log('lessons before: ', lessons)
            for (const i in videos) {
                const s3Response: any = await uploadS3Video(videos[i]);
                if (s3Response.error) {
                    console.log(s3Response.msg)
                }
                const url = s3Response.Location
                console.log('url of the video from the s3bucket: ', url)
                lessons[i].video = url
            }
            console.log('lessons after: ', lessons)

            const newSection = new Section({
                sectionname: title,
                description: description,
                lessons: lessons,
                courseid: courseId,
            });
            console.log('db insertion data: ', newSection)
            await newSection.save();
            res.status(200).json({ message: 'Section saved', newSection });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    // addsection: asyncHandler(async (req: Request, res: Response) => {
    //     try {
    //         const { title, description, lessons } = JSON.parse(req.body.section);
    //         console.log('lessonssss: ', lessons)
    //         const courseId = req.body.courseId
    //         const video = req.file;

    //         const s3Response: any = await uploadS3Video(video)

    //         if (s3Response.error) {
    //             // throw new Error(s3Response.msg)
    //             console.log(s3Response.msg)
    //         }
    //         const url = s3Response.Location
    //         console.log('url of the image from the s3bucket: ', url)

    //         const newSection = new Section({
    //             sectionname: title,
    //             description: description,
    //             lessons: lessons,
    //             courseid: courseId,
    //         });
    //         await newSection.save();
    //         const sectionId = newSection._id;
    //         res.status(200).json({ message: 'Section saved', newSection });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // }),

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

    // editSection
    editSection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const title = req.body.title
            const description = req.body.description
            const sectionId = req.body.sectionId
            const section = await Section.findById(sectionId)
            if(section) {
                section.sectionname = req.body.title
                section.description = req.body.description
                await section.save()
                res.status(200).json({ message: 'Section edited succesfully.', section });
            } else {
                res.status(500).json({ error: 'Section not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error editing section data.' });
        }
    }),

    // editLesson
    editLesson: asyncHandler(async (req: Request, res: Response) => {
        try {
            const title = req.body.title
            const description = req.body.description
            const sectionId = req.body.sectionId
            const lessonIndex = req.body.lessonIndex
            const section = await Section.findById(sectionId)
            const lesson = section?.lessons[lessonIndex]
            if(lesson) {
                section.lessons[lessonIndex].title = title
                section.lessons[lessonIndex].description = description
                await section.save()
                const newlesson = section.lessons[lessonIndex]
                res.status(200).json({ message: 'Lesson details edited succesfully.', newlesson });
            } else {
                res.status(500).json({ error: 'Lesson not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error editing lesson data.' });
        }
    }),
}
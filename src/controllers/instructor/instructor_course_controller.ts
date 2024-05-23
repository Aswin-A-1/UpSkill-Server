import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Instructor } from '../../models/instructor_model';
import { Course } from '../../models/course_model';
import { Section } from '../../models/section_model';
import { uploadS3Image, uploadS3Video } from '../../utils/s3uploader';
import mongoose from 'mongoose';
import { ResponseStatus } from '../../types/ResponseStatus';


export const InstructorCourseController = {

    // Add course details
    addcoursedetails: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { courseName, courseDescription, courseCategory, coursePrice, instructorId } = req.body;
            const imageFile = req.file as Express.Multer.File
            const s3Response: any = await uploadS3Image(imageFile);
            let thumbnailImage = ''
            if (!s3Response.error) {
                thumbnailImage = s3Response.Location
                console.log('url of the video from the s3bucket: ', thumbnailImage)
            } else {
                res.status(ResponseStatus.InternalServerError).json({ error: 'Failed to upload file' });
            }
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
            res.status(ResponseStatus.OK).json({ message: 'Course created, add sections', courseId });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // Add section
    addsection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { title, description, lessons } = JSON.parse(req.body.section);
            const courseId = req.body.courseId
            const course = await Course.findById(courseId)
            const videos = req.files as Express.Multer.File[];
            for (const i in videos) {
                const s3Response: any = await uploadS3Video(videos[i]);
                if (s3Response.error) {
                    console.log(s3Response.msg)
                }
                const url = s3Response.Location
                console.log('url of the video from the s3bucket: ', url)
                lessons[i].video = url
            }

            const newSection = new Section({
                sectionname: title,
                description: description,
                lessons: lessons,
                courseid: courseId,
            });
            await newSection.save();
            if(course) {
                course.sections.push(newSection._id)
                if(course.sections.length > 0) {
                    course.isActive = true
                }
                await course.save();
            }
            res.status(ResponseStatus.OK).json({ message: 'Section saved', newSection });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // getCourseDetails
    getCourse: asyncHandler(async (req: Request, res: Response) => {
        try {
            const instructorid = req.params.instructorid
            const courses = await Course.find({ instructorid: instructorid });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching course data.' });
        }
    }),

    // getVerification
    getVerification: asyncHandler(async (req: Request, res: Response) => {
        try {
            const instructorid = req.params.instructorid
            const instructor = await Instructor.findById(instructorid)
            const verification = instructor?.isVerified
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', verification });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching instructor data.' });
        }
    }),

    // getSection
    getSection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courseid = req.params.courseid
            const sections = await Section.find({ courseid: courseid });
            res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', sections });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching section data.' });
        }
    }),

    // editSection
    editSection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const sectionId = req.body.sectionId
            const section = await Section.findById(sectionId)
            if (section) {
                section.sectionname = req.body.title
                section.description = req.body.description
                await section.save()
                res.status(ResponseStatus.OK).json({ message: 'Section edited succesfully.', section });
            } else {
                res.status(ResponseStatus.InternalServerError).json({ error: 'Section not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error editing section data.' });
        }
    }),

    // deleteSection
    deleteSection: asyncHandler(async (req: Request, res: Response) => {
        try {
            const sectionId = req.body.sectionId
            const result = await Section.findByIdAndDelete(sectionId);
            if(result) {
                res.status(ResponseStatus.OK).json({ message: 'Section deleted succesfully.' });
            } else {
                res.status(ResponseStatus.InternalServerError).json({ error: 'No such section.' });
            }
        } catch (error) {
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error deleting section data.' });
        }
    }),

    // deleteLesson
    deleteLesson: asyncHandler(async (req: Request, res: Response) => {
        try {
            const sectionId = req.body.sectionId
            const lessonIndex = req.body.lessonIndex
            const section = await Section.findById(sectionId)
            if (section) {
                section.lessons.splice(lessonIndex, 1)
                await section.save()
                res.status(ResponseStatus.OK).json({ message: 'Lesson deleted succesfully.' });
            } else {
                res.status(ResponseStatus.InternalServerError).json({ error: 'Section not found.' });
            }
        } catch (error) {
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error deleting lesson data.' });
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
            if (lesson) {
                section.lessons[lessonIndex].title = title
                section.lessons[lessonIndex].description = description
                await section.save()
                const newlesson = section.lessons[lessonIndex]
                res.status(ResponseStatus.OK).json({ message: 'Lesson details edited succesfully.', newlesson });
            } else {
                res.status(ResponseStatus.InternalServerError).json({ error: 'Lesson not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error editing lesson data.' });
        }
    }),

    // editLessonWithVideo
    editLessonWithVideo: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { title, description, sectionId, lessonIndex } = req.body;
            const videoFile = req.file as Express.Multer.File
            const s3Response: any = await uploadS3Video(videoFile);
            if (!s3Response.error) {
                const url = s3Response.Location
                console.log('url of the video from the s3bucket: ', url)
                const section = await Section.findById(sectionId)
                const lesson = section?.lessons[lessonIndex]
                if (lesson) {
                    section.lessons[lessonIndex].title = title
                    section.lessons[lessonIndex].description = description
                    section.lessons[lessonIndex].video = url
                    await section.save()
                    const newlesson = section.lessons[lessonIndex]
                    res.status(ResponseStatus.OK).json({ message: 'Lesson details and video edited succesfully.', newlesson });
                } else {
                    res.status(ResponseStatus.InternalServerError).json({ error: 'Lesson not found.' });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error editing lesson data.' });
        }
    }),


    // addNewLesson
    addNewLesson: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { title, description, sectionId } = req.body;
            const videoFile = req.file as Express.Multer.File
            const s3Response: any = await uploadS3Video(videoFile);
            if (!s3Response.error) {
                const url = s3Response.Location
                console.log('url of the video from the s3bucket: ', url)
                const section = await Section.findById(sectionId)
                if (section) {
                    const newLesson = {
                        _id: new mongoose.Types.ObjectId(),
                        title,
                        description,
                        video: url
                    };

                    section.lessons.push(newLesson);
                    await section.save()
                    res.status(ResponseStatus.OK).json({ message: 'Lesson added succesfully.', newLesson });
                } else {
                    res.status(ResponseStatus.InternalServerError).json({ error: 'Sectionn not found.' });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error adding lesson.' });
        }
    }),
}
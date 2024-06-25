import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';
import { Enrollment } from '../../models/enrollment_model';


export const AdminCourseController = {
    

    // getDashboardData
    getDashboardData: asyncHandler(async (req: Request, res: Response) => {
        try {
            const courses = await Course.find();
            const courseNamesMap: Record<string, any> = {};
            for (const course of courses) {
                courseNamesMap[course._id] = course.coursename;
            }

            const courseIds = courses.map(course => course._id);

            const enrollments = await Enrollment.find({ courseid: { $in: courseIds } });
            let totalRevenue = 0;
            const uniqueStudentIds = new Set();
            const courseEnrollmentCount: { [key: string]: number } = {};
            const monthlyEnrollments: { [key: string]: number } = {};
            const individualCourseMonthlyEnrollments: { [key: string]: { [key: string]: number } } = {};

            enrollments.forEach(enrollment => {
                totalRevenue += enrollment.amount;
                uniqueStudentIds.add(enrollment.studentid.toString());

                const courseId = enrollment.courseid.toString();
                const courseName = courseNamesMap[courseId];
                if (courseEnrollmentCount[courseId]) {
                    courseEnrollmentCount[courseId]++;
                } else {
                    courseEnrollmentCount[courseId] = 1;
                }

                const date = new Date(enrollment.dateofEnrollment);
                const enrollmentMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

                if (monthlyEnrollments[enrollmentMonth]) {
                    monthlyEnrollments[enrollmentMonth]++;
                } else {
                    monthlyEnrollments[enrollmentMonth] = 1;
                }

                if (!individualCourseMonthlyEnrollments[courseName]) {
                    individualCourseMonthlyEnrollments[courseName] = {};
                }

                if (individualCourseMonthlyEnrollments[courseName][enrollmentMonth]) {
                    individualCourseMonthlyEnrollments[courseName][enrollmentMonth]++;
                } else {
                    individualCourseMonthlyEnrollments[courseName][enrollmentMonth] = 1;
                }
            })

            const totalStudents = uniqueStudentIds.size;
            let trendingCourseId = null;
            let maxEnrollments = 0;
            for (const courseId in courseEnrollmentCount) {
                if (courseEnrollmentCount[courseId] > maxEnrollments) {
                    maxEnrollments = courseEnrollmentCount[courseId];
                    trendingCourseId = courseId;
                }
            }

            let trendingCourse = null;
            if (trendingCourseId) {
                trendingCourse = await Course.findById(trendingCourseId);
            }
            res.status(ResponseStatus.OK).json({ message: 'Successfully fetched dashboard data', totalRevenue, totalStudents, trendingCourse: trendingCourse ? trendingCourse.coursename : 'No course', monthlyEnrollments, individualCourseMonthlyEnrollments });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Error fetching dashboard data.' });
        }
    }),

}
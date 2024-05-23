import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Instructor } from '../../models/instructor_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { uploadS3ProfileImage } from '../../utils/s3uploader';

export const InstructorProfileController = {

    // updateProfile
    updateProfile: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { qualification, instructorId } = req.body;
            const files = req.files as Express.Multer.File[];
            let profilePic: Express.Multer.File | undefined;
            const certificates: Express.Multer.File[] = [];

            for (const file of files) {
                if (file.fieldname === 'profileImageFile') {
                    profilePic = file;
                } else if (file.fieldname.startsWith('certificate_')) {
                    certificates.push(file);
                }
            }
            console.log('qualification: ', qualification)
            console.log('profile pic: ', profilePic)
            console.log('certificates', certificates)
            const instructor = await Instructor.findById(instructorId)
            if(instructor) {
                if(qualification != '') {
                    instructor.qualification = qualification
                }
                if(profilePic != undefined) {
                    const s3Response: any = await uploadS3ProfileImage(profilePic);
                    if (s3Response.error) {
                        console.log(s3Response.msg)
                    }
                    const url = s3Response.Location
                    console.log('url of the video from the s3bucket: ', url)
                    instructor.profilepic = url
                }
                if(certificates.length > 0) {
                    for (const i in certificates) {
                        const s3Response: any = await uploadS3ProfileImage(certificates[i]);
                        if (s3Response.error) {
                            console.log(s3Response.msg)
                        }
                        const url = s3Response.Location
                        console.log('url of the video from the s3bucket: ', url)
                        instructor.certificates.push(url)
                    }
                }
                await instructor.save()
                res.status(ResponseStatus.OK).json({ message: 'Profile updated', instructor });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

};

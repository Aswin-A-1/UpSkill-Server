import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import bcrypt from 'bcryptjs';
import { Otp } from '../../models/session_model';
import { generateToken } from '../../utils/jwtToken';
import { Instructor } from '../../models/instructor_model';
import { ResponseStatus } from '../../types/ResponseStatus';
import { generateOTP, sendOtpEmail } from '../../utils/otp';

declare module 'express-session' {
    interface SessionData {
        generatedOtp: string;
    }
}

export const InstructorController = {

    // registration
    registerInstructor: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;
            const emailExists = await Instructor.findOne({ email });
            if (emailExists) {
                res.status(ResponseStatus.BadRequest).json({ error: 'Email already registered' });
            } else {
                // Generate OTP
                const otp = generateOTP(4);
                console.log('OTP : ', otp);
                // Send OTP via email
                await sendOtpEmail(email, otp);

                // Saving OTP to database
                const otpRecord = await Otp.findOne({ email });
                try {
                    if (otpRecord) {
                        otpRecord.otp = otp;
                        await otpRecord.save();
                    } else {
                        const newOtpRecord = new Otp({ otp, email });
                        await newOtpRecord.save();
                    }
                } catch (error) {
                    console.error('Failed to save OTP:', error);
                }
                res.status(ResponseStatus.OK).json({ message: 'OTP sented to mail.', email });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // verifying otp
    verifyOtp: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { userData, enteredOtp } = req.body
            const { username, email, password } = JSON.parse(userData);
            const otpRecord = await Otp.findOne({ email });
            
            if (otpRecord) {
                if (otpRecord.otp == enteredOtp) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newStudent={
                        username,
                        email,
                        password:hashedPassword
                    }
                    await Instructor.create(newStudent)
                    .then(success=>{
                        res.status(ResponseStatus.OK).json({ message: 'Signup succesfull  :)' });
                    }).catch(error=>{
                        console.log('fail',error);
                    })
                    
                } else {
                    res.status(ResponseStatus.BadRequest).json({ error: 'Incorrect OTP  :(' });
                }
            } else {
                res.status(ResponseStatus.BadRequest).json({ error: 'OTP is exipired.' });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Failed to register.' });
        }
    }),

    // resendOtp
    resendOtp: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            // Generate OTP
            const otp = generateOTP(4);
            console.log('NEW OTP : ', otp);
            // Send OTP via email
            await sendOtpEmail(email, otp);

            // Saving OTP to database
            const otpRecord = await Otp.findOne({ email });
            try {
                if (otpRecord) {
                    await Otp.deleteOne({ email });
                }
                const newOtpRecord = new Otp({ otp, email });
                await newOtpRecord.save();
                console.log('New OTP saved in MongoDB');
            } catch (error) {
                console.error('Failed to save OTP:', error);
            }
            res.status(ResponseStatus.OK).json({ message: 'New OTP sent to mail.', email });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // login
    instructorlogin: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const instructor = await Instructor.findOne({ email });
            if (instructor) {
                // Checking password match
                const hashedPasswordFromDB = instructor.password;
                const isPasswordCorrect = await bcrypt.compare(password, hashedPasswordFromDB);

                if (isPasswordCorrect) {
                    if (!instructor.isBlocked) {
                        // generate jwt token
                        const token = generateToken(instructor._id, instructor.role, process.env.JWT_SECRET as string);
                        res.status(ResponseStatus.OK).json({ message: 'Login succesfull', token, instructor });
                    } else {
                        res.status(ResponseStatus.BadRequest).json({ message: 'Account is blocked' });
                    }
                } else {
                    res.status(ResponseStatus.BadRequest).json({ message: 'Incorrect password' });
                }
            } else {
                res.status(ResponseStatus.NotFound).json({ message: 'Incorrect email and password' });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

    // home
    test: asyncHandler(async (req: Request, res: Response) => {
        try {
            const user = await Student.findById(req.user_id);
        } catch (error) {
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),
};

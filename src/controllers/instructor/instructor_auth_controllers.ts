import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Otp } from '../../models/session_model';
import { generateToken } from '../../utils/jwtToken';
import { Instructor } from '../../models/instructor_model';

declare module 'express-session' {
    interface SessionData {
        generatedOtp: string;
    }
}

// OTP generator function
const generateOTP = (length: number): string => {
    const digits = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        OTP += digits[randomIndex];
    }

    return OTP;
};

// Email sending function
const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || '',
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER || '',
        to: email,
        subject: "One-Time Password (OTP) for Authentication for UpSkill",
        text: `Your Authentication OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


export const InstructorController = {

    // registration
    registerInstructor: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;
            const emailExists = await Instructor.findOne({ email });
            if (emailExists) {
                res.status(400).json({ error: 'Email already registered' });
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
                res.status(200).json({ message: 'OTP sented to mail.', email });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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
                        res.status(200).json({ message: 'Signup succesfull  :)' });
                    }).catch(error=>{
                        console.log('fail',error);
                    })
                    
                } else {
                    res.status(400).json({ error: 'Incorrect OTP  :(' });
                }
            } else {
                res.status(400).json({ error: 'OTP is exipired.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to register.' });
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
            res.status(200).json({ message: 'New OTP sent to mail.', email });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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
                        const token = generateToken(instructor._id, process.env.JWT_SECRET as string);
                        res.status(200).json({ message: 'Login succesfull', token, instructor });
                    } else {
                        res.status(400).json({ message: 'Account is blocked' });
                    }
                } else {
                    console.log('password mismatchs')
                    res.status(400).json({ message: 'Incorrect password' });
                }
            } else {
                console.log('sending incorrect password error :)')
                res.status(400).json({ message: 'Incorrect email and password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }),

    // home
    test: asyncHandler(async (req: Request, res: Response) => {
        try {
            console.log('Request user_id: ', req.user_id)
            const user = await Student.findById(req.user_id);
            console.log(user)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
};

import crypto from 'crypto';
import nodemailer from 'nodemailer';

// otp generator function
export const generateOTP = (length: number): string => {
    const digits = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        OTP += digits[randomIndex];
    }

    return OTP;
};

// Email sending function
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
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
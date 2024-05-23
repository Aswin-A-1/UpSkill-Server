import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Student } from '../../models/student_model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwtToken';
import { ResponseStatus } from '../../types/ResponseStatus';


export const AdminAuthController = {

    // login
    adminlogin: asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const admin = await Student.findOne({ email, role: "Admin" });
            if (admin) {
                // Checking password match
                const hashedPasswordFromDB = admin.password;
                const isPasswordCorrect = await bcrypt.compare(password, hashedPasswordFromDB);

                if (isPasswordCorrect) {
                    if (!admin.isBlocked) {
                        // generate jwt token
                        const token = generateToken(admin._id, admin.role, process.env.JWT_SECRET as string);
                        res.status(ResponseStatus.OK).json({ message: 'Login succesfull', token, admin });
                    } else {
                        res.status(ResponseStatus.BadRequest).json({ message: 'Account is blocked' });
                    }
                } else {
                    res.status(ResponseStatus.BadRequest).json({ message: 'Incorrect password' });
                }
            } else {
                console.log('amdin not found')
                res.status(ResponseStatus.BadRequest).json({ message: 'Incorrect email and password' });
            }
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),
};

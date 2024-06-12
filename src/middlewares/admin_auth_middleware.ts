import { Request,Response } from 'express';
import jwt, { VerifyErrors, Secret } from 'jsonwebtoken';
import { Student } from '../models/student_model';

interface User {
    _id: string;
}

// Extend the Express request interface
declare global {
    namespace Express {
        interface Request {
            user_id?: string;
        }
    }
}

const authenticateAdminToken = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization-admin'];

    if (typeof authHeader !== 'string') {
        return res.sendStatus(400); // If there's no token, return 401 (Unauthorized)
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(400); // If there's no token, return 401 (Unauthorized)
    }

    // Ensure the secret is defined and of the correct type
    const secret: Secret = process.env.JWT_SECRET as string;

    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: User | any) => {
        if (err) {
            return res.sendStatus(400);
        } else {
            const admin = await Student.find({ _id: decoded.id, role: 'Admin' });
            if(admin) {
                req.user_id = decoded.id;
                next();
            } else {
                return res.sendStatus(400);
            }
        }
    });
};

export default authenticateAdminToken;

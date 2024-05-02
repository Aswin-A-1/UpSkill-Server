import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, secretKey: string): string => {
    return jwt.sign({ id: userId }, secretKey, {
        expiresIn: '10d',
    });
};
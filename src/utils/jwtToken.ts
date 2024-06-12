import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, userType: string, secretKey: string): string => {
    return jwt.sign({ id: userId, user_type: userType }, secretKey, {
        expiresIn: '5h',
    });
};
export const generateRefreshToken = (userId: string, userType: string, secretKey: string): string => {
    return jwt.sign({ id: userId, user_type: userType }, secretKey, {
        expiresIn: '5d',
    });
};
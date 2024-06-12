import jwt from 'jsonwebtoken';


export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    isBlocked: boolean;
}




export const verifyRefreshToken = (token: string) => {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user) => {
            if (err) {
                return resolve(false);
            }
            if (user) {
                return resolve(true);
            }
        });
    });
}

export const generatenewtoken = (token: string): Promise<string | null> => {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err || !decoded) {
                return resolve(null);
            }

            const user = decoded as User;

            // Define the payload to be signed
            const plainPayload = {
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
                isBlocked: user.isBlocked,
                _id: user._id,
            };

            // Create a new access token with the plainPayload
            const newAccessToken = jwt.sign(plainPayload, process.env.JWT_SECRET as string, { expiresIn: "5h" });
            resolve(newAccessToken); // Resolve with the new access token
        });
    });
};
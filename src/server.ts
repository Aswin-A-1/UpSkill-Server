import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

import crypto from 'crypto';
import MongoStore from 'connect-mongo'
import { connectDatabase } from './config/db';

import { studentRoute } from './routes/student_routes';
import { adminRoute } from './routes/admin_routes';
import { instructorRoute } from './routes/instructor_routes';
import { googleRoute } from './routes/google_auth_routes';
import { corsOption } from './config/cors_config';

import './auth/passport'
import { configureSocket } from './socket/socketConnection';

dotenv.config();
connectDatabase();


const secret = process.env.SECRET || crypto.randomBytes(32).toString('hex');

const app = express()

app.use(cookieParser());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

const PORT: any = process.env.PORT || 3000;

app.use(express.json());

app.use(cors(corsOption));


// app.get('/', (req: Request, res: Response) => {
//     res.send('UpSkill')
// })

// student routes
app.use('/api/student', studentRoute)

// admin routes
app.use('/api/admin', adminRoute)

// instructor routes
app.use('/api/instructor', instructorRoute)

app.use('/auth/google', googleRoute)

app.use(express.static(path.join(__dirname, 'public')))



app.get('*', (req: Request, res: Response) => res.sendStatus(404));

const server = app.listen(PORT, () => {
    console.log('app running on port ', PORT)
})

configureSocket(server)
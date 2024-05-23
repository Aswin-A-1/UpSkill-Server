import mongoose, { Schema, Document } from 'mongoose'

export interface InstructorDocument extends Document {
    googleId?: number;
    username: string;
    email: string;
    qualification: string;
    profilepic: string;
    certificates: string[];
    password: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
}

const instructorSchema = new Schema({
    googleId: { type: Number },
    username: { type: String, required: true },
    email: { type: String, required: true },
    qualification: { type: String, default: '' },
    profilepic: { type: String, default: '' },
    certificates: { type: [String], default: [] },
    password: { type: String },
    role: { type: String, required: true, default: 'Instructor' },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
})

export const Instructor = mongoose.model<InstructorDocument>('Instructor', instructorSchema)
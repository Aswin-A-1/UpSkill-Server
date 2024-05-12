import mongoose, { Schema, Document } from 'mongoose'

export interface CourseDocument extends Document {
    coursename: string;
    description: string;
    category: string,
    price: number;
    thumbnailimage: string;
    sections: string[];
    instructorid: mongoose.Schema.Types.ObjectId,
    isBlocked: boolean;
    isActive: boolean;
}

const courseSchema = new Schema({
    coursename: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnailimage: { type: String, required: true },
    sections: [{ type: String, default: [] }],
    instructorid: { type: mongoose.Schema.Types.ObjectId, required: true },
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }
})

export const Course = mongoose.model<CourseDocument>('Course', courseSchema)
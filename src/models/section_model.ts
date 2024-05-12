import mongoose, { Schema, Document } from 'mongoose'

interface Lesson {
    title: string;
    description: string;
    video: string;
}

const lessonSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: false }
});

export interface SectionDocument extends Document {
    sectionname: string;
    description: string;
    lessons: Lesson[];
    courseid: mongoose.Schema.Types.ObjectId;
    isFree: boolean;
}

const sectionSchema = new Schema({
    sectionname: { type: String, required: true },
    description: { type: String, required: true },
    lessons: [lessonSchema],
    courseid: { type: mongoose.Schema.Types.ObjectId, required: true },
    isFree: { type: Boolean, default: false },
});

export const Section = mongoose.model<SectionDocument>('Section', sectionSchema);

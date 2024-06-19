import mongoose, { Schema, Document } from 'mongoose'

export interface EnrollmentDocument extends Document {
    paymentid: string,
    amount: number,
    studentid: mongoose.Schema.Types.ObjectId,
    courseid: mongoose.Schema.Types.ObjectId,
    completedlessons: string[];
    dateofEnrollment: Date,
    premium: boolean,
}

const enrollmentSchema = new Schema({
    paymentid: { type: String, required: true },
    amount: { type: Number, required: true },
    studentid: { type: mongoose.Schema.Types.ObjectId, required: true },
    courseid: { type: mongoose.Schema.Types.ObjectId, required: true },
    completedlessons: [{ type: String, default: [] }],
    dateofEnrollment: { type: Date, default: Date.now },
    premium: { type: Boolean, default: false }
})

export const Enrollment = mongoose.model<EnrollmentDocument>('Enrollment', enrollmentSchema)
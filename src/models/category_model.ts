import mongoose, { Schema, Document } from 'mongoose'

export interface CategoryDocument extends Document {
    name: string;
    isBlocked: boolean;
}

const categorySchema = new Schema({
    name: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
});

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);

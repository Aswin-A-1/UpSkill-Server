import mongoose, { Document, Schema } from 'mongoose';

export interface WishlistDocument extends Document {
  studentId: string;
  courses: string[];
}

const WishlistSchema: Schema = new Schema({
  studentId: { type: String, required: true },
  courses: [{ type: String, default: [] }],
});

export const Wishlist = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);

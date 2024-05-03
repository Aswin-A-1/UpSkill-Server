import mongoose ,{Schema,Document} from 'mongoose'

export interface InstructorDocument extends Document{
    googleId?: number;
    username:string;
    email:string;
    password:string;
    role:string;
    isBlocked: boolean;
}

const instructorSchema = new Schema({
    googleId: { type: Number} ,
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String},
    role:{type:String,required:true,default:'Instructor'},
    isBlocked: { type: Boolean, default: false }
})

export const Instructor = mongoose.model<InstructorDocument>('Instructor', instructorSchema)
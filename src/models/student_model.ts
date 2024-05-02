import mongoose ,{Schema,Document} from 'mongoose'

export interface StudentDocument extends Document{
    googleId?: number;
    username:string;
    email:string;
    password:string;
    role:string;
    isBlocked: boolean;
}

const studentSchema = new Schema({
    googleId: { type: Number} ,
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String},
    role:{type:String,required:true,default:'Student'},
    isBlocked: { type: Boolean, default: false }
})

export const Student = mongoose.model<StudentDocument>('Student', studentSchema)
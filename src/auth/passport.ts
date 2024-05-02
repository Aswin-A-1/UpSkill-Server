import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';
import { Student } from "../models/student_model";

dotenv.config();

type User={
  id?:number
}

passport.serializeUser((user:User,done)=>{
    done(null,user.id)
})
passport.deserializeUser((id,done)=>{
    Student.findById(id).then(user=>{
        done(null,user)
    })
})


passport.use(
  new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
  },
  (accessToken,refreshToken,profile,done) => {
    console.log(profile);
    
    Student.findOne({googleId:profile.id})
    .then((currentUser)=>{
        if(currentUser){
            console.log('user is here',currentUser);
            done(null,currentUser)
            //user here
        }else{

            new Student({
                googleId: profile.id,
                email: profile.emails?.[0]?.value ?? 'default@email.com',
                username: profile.displayName
              }).save().then(newuser=>{
                console.log('created',newuser);
                done(null,newuser)
                return 
              }).catch(error=>{
                console.log('error',error);
              })
        }
    })
  })
);
import express, { Router, Request, Response } from 'express';
import { InstructorController } from '../controllers/instructor/instructor_auth_controllers';
import multer from 'multer';
import { InstructorCourseController } from '../controllers/instructor/instructor_course_controller';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const videostorage = multer.memoryStorage();
const videoupload = multer();
const singleVideoUpload = multer({ storage: videostorage })
// const videoMemoryStorage = multer.memoryStorage();
// const fileSizeLimit = 10 * 1024 * 1024;

// const videoMemoryUpload = multer({
//     storage: videoMemoryStorage,
//     limits: {
//         fileSize: fileSizeLimit
//     }
// });


const router: Router = express.Router();

router.post('/signup', InstructorController.registerInstructor);
router.post('/signup/verify-otp', InstructorController.verifyOtp);
router.post('/login', InstructorController.instructorlogin);
router.post('/coursedetails', upload.single('courseImage'), InstructorCourseController.addcoursedetails);
router.post('/savesection', videoupload.any(), InstructorCourseController.addsection);
// router.post('/savesection', videoupload.single('videoFile'), InstructorCourseController.addsection);
router.get('/getcourse/:instructorid', InstructorCourseController.getCourse);
router.get('/getsection/:courseid', InstructorCourseController.getSection);
router.post('/editsection', InstructorCourseController.editSection);
router.post('/editlesson', InstructorCourseController.editLesson);
router.post('/editlessonwithvideo', singleVideoUpload.single('videofile'), InstructorCourseController.editLessonWithVideo);


export const instructorRoute = router;
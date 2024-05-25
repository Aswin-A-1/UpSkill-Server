import express, { Router, Request, Response } from 'express';
import { InstructorController } from '../controllers/instructor/instructor_auth_controllers';
import multer from 'multer';
import { InstructorCourseController } from '../controllers/instructor/instructor_course_controller';
import authenticateInstructorToken from '../middlewares/instructor_auth_middleware';
import { InstructorProfileController } from '../controllers/instructor/instructor_profile_controllers';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/courseImage');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const videostorage = multer.memoryStorage();
const videoupload = multer();
const singleVideoUpload = multer({ storage: videostorage })
const singleImageUpload = multer({ storage: videostorage })
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
router.post('/coursedetails', singleImageUpload.single('courseImage'), InstructorCourseController.addcoursedetails);
router.post('/savesection', videoupload.any(), InstructorCourseController.addsection);
router.get('/getcourse/:instructorid', authenticateInstructorToken, InstructorCourseController.getCourse);
router.get('/getverification/:instructorid', authenticateInstructorToken, InstructorCourseController.getVerification);
router.get('/getsection/:courseid', authenticateInstructorToken, InstructorCourseController.getSection);
router.post('/editsection', InstructorCourseController.editSection);
router.post('/editlesson', InstructorCourseController.editLesson);
router.post('/editlessonwithvideo', singleVideoUpload.single('videofile'), InstructorCourseController.editLessonWithVideo);
router.post('/addlesson', singleVideoUpload.single('videofile'), InstructorCourseController.addNewLesson);
router.post('/deletesection', InstructorCourseController.deleteSection);
router.post('/deletelesson', InstructorCourseController.deleteLesson);
router.post('/updateprofile', videoupload.any(), InstructorProfileController.updateProfile);
router.post('/updateverification', authenticateInstructorToken, InstructorProfileController.updateVerification);
router.post('/updateBlock', authenticateInstructorToken, InstructorProfileController.updateBlock);
router.get('/getprofile/:instructorid', authenticateInstructorToken, InstructorProfileController.getInstructorProfile);


export const instructorRoute = router;
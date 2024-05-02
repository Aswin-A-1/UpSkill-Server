
import express, { Router, Request, Response } from 'express';
import passport from 'passport'
import { generateToken } from '../utils/jwtToken';
const router: Router = express.Router();

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))
// router.get('/', (req: Request, res: Response) => {
//     console.log('recivie request')
//     // res.status(200).json({ message: 'Google authentication succesfull'});
// })
router.get('/redirect', passport.authenticate('google'), (req: Request, res: Response) => {
    // res.redirect('http://localhost:4200/login');
    // res.status(200).json({ message: 'Google authentication succesfull', user: req.user });
    const message = 'Google authentication successful';
    const user = JSON.stringify(req.user);
    // generate jwt token
    const user_id = JSON.parse(user)._id
    const token = generateToken(user_id, process.env.JWT_SECRET as string);
    res.cookie('authResponse', JSON.stringify({ message, user, token }));
    res.redirect('http://localhost:4200/login');
})

export const googleRoute = router;
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ResponseStatus } from '../../types/ResponseStatus';
import { Course } from '../../models/course_model';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);



export const StudentPaymentController = {

    // initPayment
    initPayment: asyncHandler(async (req: Request, res: Response) => {
        console.log('working')
        try {
            const { token, amount } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                payment_method_types: ['card'],
                confirm: true,
                payment_method: token
              });
        
            // res.send({
            //   client_secret: paymentIntent.client_secret
            // });
            res.status(ResponseStatus.OK).json({ message: 'Payment successfully initiated', client_secret: paymentIntent.client_secret });

            // res.status(ResponseStatus.OK).json({ message: 'Succesfully fetched data', courses });
        } catch (error) {
            console.error(error);
            res.status(ResponseStatus.InternalServerError).json({ error: 'Internal server error' });
        }
    }),

};

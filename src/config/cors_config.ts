export const corsOption =  {
    origin: 'https://up-skill-five.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization-student', 'authorization-instructor', 'authorization-admin',"Access-Control-Allow-Origin"],
    credentials: true
}

// ./config/cors_config.ts
// import { CorsOptions } from 'cors';

// const corsOption: CorsOptions = {
//   origin: 'http://localhost:4200/', // Replace with your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// };

// export { corsOption };

export const corsOption =  {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization-student', 'authorization-instructor', 'authorization-admin',"Access-Control-Allow-Origin"],
    credentials: true
}
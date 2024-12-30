import express from 'express';
import { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
// import connectDB from './config/connectDB.js';
import model from './routes/model.js';
// import user from './routes/user.js';

config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 8000;

/* Middleware */
app.use(json());
app.use(cors());

/* Routes */
// app.use('/api/v1/user', user);
app.use('/api/v1/model', model);

/* Uncomment to connect to the database */
// connectDB();

/* Start the server */
app.listen(PORT, () => {
    console.log("Server listening at port:", PORT);
});

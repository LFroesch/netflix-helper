import express, { application } from 'express';

import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import tvRoutes from './routes/tv.route.js';
import dotenv from 'dotenv';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { protectRoute } from './middleware/protectRoute.js';
import searchRoutes from './routes/search.route.js';
import personRoutes from './routes/person.route.js';

dotenv.config();
const app = express();
const PORT = ENV_VARS.PORT
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send(`
        <h1>Hello World!</h1>
        <ul>
            <li><a href="/api/v1/auth/signup">Signup</a></li>
            <li><a href="/api/v1/auth/login">Login</a></li>
            <li><a href="/api/v1/auth/logout">Logout</a></li>
        </ul>
    `);
});




app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/person", protectRoute, personRoutes);



console.log("MONGO_URI: ", process.env.MONGO_URI);
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
    connectDB();
})

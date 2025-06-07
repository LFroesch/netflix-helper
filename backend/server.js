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
import watchlistRoutes from './routes/watchlist.route.js';
import profileRoutes from './routes/profile.route.js';
import path from 'path';

dotenv.config();
const app = express();
const PORT = ENV_VARS.PORT
const __dirname = path.resolve();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/person", protectRoute, personRoutes);
app.use("/api/v1/watchlist", protectRoute, watchlistRoutes);
app.use("/api/v1/profile", protectRoute, profileRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
    connectDB();
})

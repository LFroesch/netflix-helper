import express from 'express';
import { getTrendingMovie, getMovieTrailers, getMovieDetails, getSimilarMovies, getMoviesByCategory, getMovieCredits } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/trending', getTrendingMovie);
router.get('/:id/trailers', getMovieTrailers);
router.get('/:id/details', getMovieDetails);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id/credits', getMovieCredits);
router.get("/:category", getMoviesByCategory);

export default router;
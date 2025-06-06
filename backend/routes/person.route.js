import express from 'express';
import { getPersonDetails, getPersonMovieCredits, getPersonTvCredits } from '../controllers/person.controller.js';

const router = express.Router();

router.get('/:id/details', getPersonDetails);
router.get('/:id/movie-credits', getPersonMovieCredits);
router.get('/:id/tv-credits', getPersonTvCredits);

export default router;
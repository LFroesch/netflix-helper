import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
        const englishMovies = data.results.filter(movie => movie.original_language === 'en');
        const randomMovie = englishMovies[Math.floor(Math.random() * englishMovies.length)];
        res.json({
            success: true,
            content: randomMovie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getMovieTrailers(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        res.json({
            success: true,
            trailers: data.results
        });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getMovieDetails(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.status(200).json({
            success: true,
            content: data
        });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getSimilarMovies(req, res) {
    const {id} = req.params;
    const { pages = 3 } = req.query; // Default to 3 pages
    
    try {
        const pageNumbers = Array.from({length: pages}, (_, i) => i + 1);
        const promises = pageNumbers.map(page => 
            fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`)
        );
        
        const responses = await Promise.all(promises);
        const allResults = responses.flatMap(data => data.results);
        
        const englishMovies = allResults
            .filter(movie => movie.original_language === 'en')
            .filter((movie, index, self) => index === self.findIndex(m => m.id === movie.id));
        
        res.status(200).json({
            success: true,
            similar: englishMovies,
            totalPages: pages,
            totalResults: englishMovies.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getMoviesByCategory(req, res) {
    const {category} = req.params;
    const { pages = 3 } = req.query; // Default to 3 pages for categories
    
    try {
        const pageNumbers = Array.from({length: parseInt(pages)}, (_, i) => i + 1);
        const promises = pageNumbers.map(page => 
            fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`)
        );
        
        const responses = await Promise.all(promises);
        const allResults = responses.flatMap(data => data.results);
        
        const englishMovies = allResults
            .filter(movie => movie.original_language === 'en')
            .filter((movie, index, self) => index === self.findIndex(m => m.id === movie.id)); // Remove duplicates
        
        res.status(200).json({
            success: true,
            content: englishMovies,
            totalPages: parseInt(pages),
            totalResults: englishMovies.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getMovieCredits(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`);
        res.status(200).json({
            success: true,
            content: data
        });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
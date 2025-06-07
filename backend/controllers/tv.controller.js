import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(req, res) {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
        const englishShows = data.results.filter(tv => tv.original_language === 'en');
        const randomTv = englishShows[Math.floor(Math.random() * englishShows.length)];
        res.json({
            success: true,
            content: randomTv
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getTvTrailers(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
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

export async function getTvDetails(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
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

export async function getSimilarTvs(req, res) {
    const {id} = req.params;
    const { pages = 3 } = req.query; // Default to 3 pages, allow customization
    
    try {
        // Fetch multiple pages
        const pageNumbers = Array.from({length: pages}, (_, i) => i + 1);
        const promises = pageNumbers.map(page => 
            fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${page}`)
        );
        
        const responses = await Promise.all(promises);
        
        // Combine all results
        const allResults = responses.flatMap(data => data.results);
        
        // Filter for English shows and remove duplicates
        const englishShows = allResults
            .filter(tv => tv.original_language === 'en')
            .filter((tv, index, self) => index === self.findIndex(t => t.id === tv.id)); // Remove duplicates
        
        res.status(200).json({
            success: true,
            similar: englishShows,
            totalPages: pages,
            totalResults: englishShows.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getTvsByCategory(req, res) {
    const {category} = req.params;
    const { pages = 3 } = req.query; // Default to 3 pages for categories
    
    try {
        const pageNumbers = Array.from({length: parseInt(pages)}, (_, i) => i + 1);
        const promises = pageNumbers.map(page => 
            fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=${page}`)
        );
        
        const responses = await Promise.all(promises);
        const allResults = responses.flatMap(data => data.results);
        
        const englishShows = allResults
            .filter(tv => tv.original_language === 'en')
            .filter((tv, index, self) => index === self.findIndex(t => t.id === tv.id)); // Remove duplicates
        
        res.status(200).json({
            success: true,
            content: englishShows,
            totalPages: parseInt(pages),
            totalResults: englishShows.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getTvCredits(req, res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`);
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
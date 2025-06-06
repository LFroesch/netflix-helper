import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

// Helper function to add search history without duplicates
async function addToSearchHistory(userId, searchHistoryItem) {
    try {
        // Remove any existing entry with the same searchTerm and searchType, then add the new one
        await User.findByIdAndUpdate(userId, {
            $pull: {
                searchHistory: {
                    searchTerm: searchHistoryItem.searchTerm,
                    searchType: searchHistoryItem.searchType
                }
            }
        });

        // Add the new search entry
        await User.findByIdAndUpdate(userId, {
            $push: {
                searchHistory: {
                    $each: [searchHistoryItem],
                    $position: 0 // Add to beginning of array (most recent first)
                }
            }
        });
    } catch (error) {
        console.log("Error adding to search history:", error.message);
    }
}

export async function searchPerson(req, res) {
    try {
        const { query } = req.params;
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`)
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        const firstResult = response.results[0];
        
        // Add to search history (this will handle duplicates)
        await addToSearchHistory(req.user._id, {
            id: firstResult.id,
            img: firstResult.profile_path,
            title: firstResult.name,
            searchType: "person",
            searchTerm: query,
            createdAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            content: response.results
        });
    } catch (error) {
        console.log("Error in searchPerson controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function searchMovie(req, res) {
    const { query } = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`)
        const englishShows = response.results.filter(show => show.original_language === 'en');
        
        if (englishShows.length === 0) {
            return res.status(404).send(null);
        }
        
        const firstResult = englishShows[0];
        
        // Add to search history (this will handle duplicates)
        await addToSearchHistory(req.user._id, {
            id: firstResult.id,
            img: firstResult.poster_path,
            title: firstResult.title,
            searchType: "movie",
            searchTerm: query,
            createdAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            content: englishShows
        });
    } catch (error) {
        console.log("Error in searchMovie controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function searchTv(req, res) {
    const { query } = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
        const englishShows = response.results.filter(show => show.original_language === 'en');
        
        if (englishShows.length === 0) {
            return res.status(404).send(null);
        }
        
        const firstResult = englishShows[0];
        
        // Add to search history (this will handle duplicates)
        await addToSearchHistory(req.user._id, {
            id: firstResult.id,
            img: firstResult.poster_path,
            title: firstResult.name,
            searchType: "tv",
            searchTerm: query,
            createdAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            content: englishShows
        });
    } catch (error) {
        console.log("Error in searchMovie controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({success: true, content: req.user.searchHistory});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function removeItemFromSearchHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory: {
                    id: id
                }
            }
        });
        res.status(200).json({success: true, message: "Item removed from search history"});
    } catch (error) {
        console.log("Error in removeItemFromSearchHistory controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
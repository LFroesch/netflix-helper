import { User } from "../models/user.model.js";

export async function addToWatchlist(req, res) {
    try {
        const { id, title, image, type } = req.body;
        
        if (!id || !title || !type) {
            return res.status(400).json({
                success: false,
                message: "ID, title, and type are required"
            });
        }

        // Check if item already exists in watchlist
        const existingItem = await User.findOne({
            _id: req.user._id,
            "watchlist.id": id
        });

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Item already in watchlist"
            });
        }

        // Add to watchlist
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                watchlist: {
                    id: id,
                    title: title,
                    image: image,
                    type: type, // "movie" or "tv"
                    createdAt: new Date()
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Added to watchlist successfully"
        });
    } catch (error) {
        console.log("Error in addToWatchlist controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function removeFromWatchlist(req, res) {
    try {
        let { id } = req.params;
        id = parseInt(id);

        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                watchlist: {
                    id: id
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Removed from watchlist successfully"
        });
    } catch (error) {
        console.log("Error in removeFromWatchlist controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getWatchlist(req, res) {
    try {
        res.status(200).json({
            success: true,
            content: req.user.watchlist || []
        });
    } catch (error) {
        console.log("Error in getWatchlist controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function checkWatchlistStatus(req, res) {
    try {
        let { id } = req.params;
        id = parseInt(id);

        const user = await User.findById(req.user._id);
        const isInWatchlist = user.watchlist?.some(item => item.id === id) || false;

        res.status(200).json({
            success: true,
            isInWatchlist: isInWatchlist
        });
    } catch (error) {
        console.log("Error in checkWatchlistStatus controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
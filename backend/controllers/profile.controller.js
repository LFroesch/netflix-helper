import { User } from "../models/user.model.js";

// Get current user's profile
export async function getMyProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.log("Error in getMyProfile controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update user bio
export async function updateBio(req, res) {
    try {
        const { bio } = req.body;
        
        if (bio && bio.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Bio must be less than 500 characters"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { bio: bio || "" },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            user: user,
            message: "Bio updated successfully"
        });
    } catch (error) {
        console.log("Error in updateBio controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get public profile of any user
export async function getUserProfile(req, res) {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-password -searchHistory');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.log("Error in getUserProfile controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get suggested users (simple random selection for now)
export async function getSuggestedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        
        // Get 6 random users excluding current user
        const users = await User.aggregate([
            { $match: { _id: { $ne: currentUserId } } },
            { $sample: { size: 6 } },
            { $project: { password: 0, searchHistory: 0 } }
        ]);

        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.log("Error in getSuggestedUsers controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
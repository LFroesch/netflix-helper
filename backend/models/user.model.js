import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    searchHistory: {
        type: Array,
        default: [],
    },
    watchlist: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
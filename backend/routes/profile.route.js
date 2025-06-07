import express from "express";
import { getMyProfile, updateBio, getUserProfile, getSuggestedUsers } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", getMyProfile);
router.put("/bio", updateBio);
router.get("/users/:id", getUserProfile);
router.get("/suggested", getSuggestedUsers);

export default router;
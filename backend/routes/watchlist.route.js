import express from "express";
import { addToWatchlist, removeFromWatchlist, getWatchlist, checkWatchlistStatus } from "../controllers/watchlist.controller.js";

const router = express.Router();

router.post("/add", addToWatchlist);
router.delete("/:id", removeFromWatchlist);
router.get("/", getWatchlist);
router.get("/status/:id", checkWatchlistStatus);

export default router;
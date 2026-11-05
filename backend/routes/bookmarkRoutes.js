
const express = require("express");
const router = express.Router();

const {
    createBookmark,
    getBookmarks,
    toggleFavorite,
    deleteBookmark
} = require("../controllers/bookmarkController");

// Create bookmark
router.post("/", createBookmark);

// Get all bookmarks / filter by tag
router.get("/", getBookmarks);

// Toggle favorite
router.patch("/:id/favorite", toggleFavorite);

// Delete bookmark
router.delete("/:id", deleteBookmark);

module.exports = router;

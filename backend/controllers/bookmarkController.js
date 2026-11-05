
const Bookmark = require("../models/Bookmark");

// CREATE BOOKMARK
const createBookmark = async (req, res) => {
    try {
        const { title, url, tag } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: "Title and URL are required"
            });
        }

        const bookmark = await Bookmark.create({
            title,
            url,
            tag: tag || "general"
        });

        res.status(201).json({
            success: true,
            message: "Bookmark created successfully",
            data: bookmark
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL BOOKMARKS + TAG FILTER
const getBookmarks = async (req, res) => {
    try {
        const { tag } = req.query;

        const filter = {};

        if (tag) {
            filter.tag = tag;
        }

        const bookmarks = await Bookmark.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookmarks.length,
            data: bookmarks
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// TOGGLE FAVORITE
const toggleFavorite = async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        bookmark.isFavorite = !bookmark.isFavorite;

        await bookmark.save();

        res.status(200).json({
            success: true,
            message: "Favorite status updated",
            data: bookmark
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE BOOKMARK
const deleteBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(
            req.params.id
        );

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bookmark deleted successfully",
            data: bookmark
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createBookmark,
    getBookmarks,
    toggleFavorite,
    deleteBookmark
};

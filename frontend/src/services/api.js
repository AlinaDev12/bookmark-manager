
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/bookmarks",
    headers: {
        "Content-Type": "application/json"
    }
});

// Get all bookmarks
export const getBookmarks = async (tag = "") => {
    const response = await API.get("/", {
        params: tag ? { tag } : {}
    });
    return response.data;
};

// Create bookmark
export const createBookmark = async (bookmarkData) => {
    const response = await API.post("/", bookmarkData);
    return response.data;
};

// Toggle favorite
export const toggleFavorite = async (id) => {
    const response = await API.patch(`/${id}/favorite`);
    return response.data;
};

// Delete bookmark
export const deleteBookmark = async (id) => {
    const response = await API.delete(`/${id}`);
    return response.data;
};

export default API;

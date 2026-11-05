
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Bookmark title is required"],
            trim: true
        },

        url: {
            type: String,
            required: [true, "Bookmark URL is required"],
            trim: true,
            validate: {
                validator: function (value) {
                    return /^https?:\/\/.+/i.test(value);
                },
                message: "URL must start with http:// or https://"
            }
        },

        tag: {
            type: String,
            default: "general",
            trim: true
        },

        isFavorite: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);

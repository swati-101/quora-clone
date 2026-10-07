const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);
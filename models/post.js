const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageJson: {
        type: String
    },
    category: {
        type: String
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    comments: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Post', postSchema)
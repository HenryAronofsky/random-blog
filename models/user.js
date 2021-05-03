const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userDescription: {
        type: String,
        default: 'Description'
    },
    userImageJson: {
        type: String,
        default: '/images/defaultUser.jpg'
    }
});

module.exports = mongoose.model('User', userSchema)
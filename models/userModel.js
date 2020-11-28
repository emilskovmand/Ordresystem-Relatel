const mongoose = require('mongoose');


// Hvordan User tabellen er skemalagt
const UserSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastLoginDate: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
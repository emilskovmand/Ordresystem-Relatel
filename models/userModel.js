const mongoose = require('mongoose');


// Hvordan User tabellen er skemalagt
const UserSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    lastLoginDate: {
        type: Date
    },
    permissions: {
        admin: {
            type: Boolean,
            default: false
        },
        relatelAdmin: {
            type: Boolean,
            default: false
        },
        createOrder: {
            type: Boolean,
            default: false
        },
        produce: {
            type: Boolean,
            default: false
        },
        approve: {
            type: Boolean,
            default: false
        },
        complete: {
            type: Boolean,
            default: false
        },
        RelatelUser: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
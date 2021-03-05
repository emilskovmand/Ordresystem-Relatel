const mongoose = require('mongoose');


// Hvordan Ordre tabellen er skemalagt
const OrderSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    OrdreId: {
        type: Number,
        min: 1,
        max: 999999
    },
    BestillingsDato: {
        type: String
    },
    Virksomhed: {
        type: String
    },
    Kundenavn: {
        type: String
    },
    AntalIndtalinger: {
        type: Number,
        min: 1
    },
    Language: {
        type: String
    },
    Mail: {
        type: String
    },
    Comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    Recording: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recording'
    },
    ValgteSpeaker: {
        type: String
    },
    Status: {
        type: String
    },
    CommentAmount: {
        type: Number,
        default: 0
    },
    Slettet: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Ordre', OrderSchema);
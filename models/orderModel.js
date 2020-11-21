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
    ValgteSpeaker: {
        type: String
    },
    Status: {
        type: String
    }
});

module.exports = mongoose.model('Ordre', OrderSchema);
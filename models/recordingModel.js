const mongoose = require('mongoose');


// Hvordan indtalinger tabellen er skemalagt
const OrderSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    recordings: [{
        text: {
            type: String
        }
    }],
    audio: [{
        url: {
            type: String
        },
        name: {
            type: String
        }
    }]
});

module.exports = mongoose.model('Recording', OrderSchema);
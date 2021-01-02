const mongoose = require('mongoose');

// Hvordan Audio tabellen er skemalagt
const AudioSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    Order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ordre'
    },
    name: {
        type: String
    },
    file: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Audio', AudioSchema);
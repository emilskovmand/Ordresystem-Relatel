const mongoose = require('mongoose');

// Hvordan Audio tabellen er skemalagt
const AudioSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String
    },
    fileID: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Audio', AudioSchema);
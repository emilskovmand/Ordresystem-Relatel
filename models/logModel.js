const mongoose = require('mongoose');


// Hvordan Log tabellen er skemalagt
const LogSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    date: {
        type: String,
        required: true,
        default: () => {
            var date = new Date();
            return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        }
    },
    operation: {
        type: String
    },
    action: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})
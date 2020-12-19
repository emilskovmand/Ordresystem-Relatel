const mongoose = require('mongoose');


// Hvordan Kommentar tabellen er skemalagt
const OrderSchema = mongoose.Schema({
    _Id: {
        type: mongoose.Types.ObjectId
    },
    array: [{
        date: {
            type: String,
            required: true,
            default: () => {
                var date = new Date();
                return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            }
        },
        message: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Comment', OrderSchema);
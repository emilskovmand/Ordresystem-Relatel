const logModel = require('./models/logModel');
const mongoose = require('mongoose');

async function SubmitUserlog(userObj, operation, action) {
    const newLog = new logModel({
        operation: operation,
        action: action,
        username: userObj.username,
        userId: userObj._id
    });

    await newLog.save();
}

module.exports = SubmitUserlog;
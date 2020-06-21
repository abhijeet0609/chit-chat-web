const moment = require('moment');

function generateMsg(sender,message) {
    return {
        message,
        sender,
        time: moment().format('h:mm a')
    }
}

module.exports.generateMsg = generateMsg;
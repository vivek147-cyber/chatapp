const moment = require('moment-timezone');

function formatmessage(username,text) {

    return{
        username,
        text,
        time: moment().utcOffset("+05:30").format('h:mm a')
    };

}

module.exports = formatmessage;

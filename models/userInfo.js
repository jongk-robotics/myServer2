var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
    user_id: String,
    phone_number: String,
    phoneBook: [{
        name: String,
        number: String
    }]
});

module.exports = mongoose.model('userInfo', userInfoSchema);

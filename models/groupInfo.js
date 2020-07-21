var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupInfoSchema = new Schema({
    group_id: String,
    group_name: String,
    memoBook: [{file_name: String, likes: Number}]
});

module.exports = mongoose.model('groupInfo', groupInfoSchema);

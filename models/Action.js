const mongoose = require('mongoose');
//id	label	description	link    imageUrl
const ActionSchema = mongoose.Schema({
    id: {type: String, require: true},
    label: {type: String, require: true},
    description: {type: String, require: true},
    link: {type: String, require: true},
    imageUrl: {type: String, require: true}
});

module.exports = mongoose.model('Action', ActionSchema);
const mongoose = require('mongoose');

const UrlSchema = mongoose.Schema({
    url: {type: String, require: true}
});

module.exports = mongoose.model('Url', UrlSchema);
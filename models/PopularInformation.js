const mongoose = require('mongoose');

const PopularInformationSchema = mongoose.Schema({
    name: {type: String, require: true},
    url: {type: String, require: true},
    score: {type: String, require: true},
    antiAbortionDonation: {type: Boolean, require: true}
});

module.exports = mongoose.model('PopularInformation', PopularInformationSchema);
const mongoose = require('mongoose');

const BrandIssuesSchema = mongoose.Schema({
    name: {type: String, require: true},
    url: {type: String, require: true},
    category: {type: String, require: true},
    fullName: {type: String, require: true},
    iconPath: {type: String, require: true},
    issueList: {type: Array, require: false}
});

module.exports = mongoose.model('BrandIssues', BrandIssuesSchema);
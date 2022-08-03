const mongoose = require('mongoose');

const PoliticalDataSchema = mongoose.Schema({
    url: {type: String, require: true},
    total: {type: Number, require: true},
    totalDemocrat: {type: Number, require: true},
    totalPAC: {type: Number, require: false},
    democratPAC: {type: Number, require: false},
    totalEmployee: {type: Number, require: false},
    democratEmployee: {type: Number, require: false},
    analysis: {type: String, require: true},
    recomendation: {type: String, require: true}
});

module.exports = mongoose.model('PoliticalData', PoliticalDataSchema);
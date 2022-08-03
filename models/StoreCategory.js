const mongoose = require('mongoose');

const StoreCategorySchema = mongoose.Schema({
    category: {type: String, require: true},
    overall: {type: String, require: true}
});

module.exports = mongoose.model('StoreCategory', StoreCategorySchema);
const mongoose = require('mongoose');

module.exports = mongoose.model('Admin', {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

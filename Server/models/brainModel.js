const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brainSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, { timestamps: true });

const brainProf = mongoose.model('brains', brainSchema);

module.exports = brainProf;

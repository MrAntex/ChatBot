const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    memory: {
        type: [{ user_id: Number, brain:{infos:{} } }],
        required: false
    },
    port: {
        type: Number,
        required:true,
        unique:true
    },
    discord_access: {
        type: Boolean,
        required:true
    },
    status: {
        type: Boolean,
        required:true
    }

}, { timestamps: true });

const BotProf = mongoose.model('bots', botSchema);

module.exports = BotProf;

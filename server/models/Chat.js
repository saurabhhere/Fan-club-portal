const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
    message: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    type: {
        type: String
    },
}, {timestamps: true});

const Chat = mongoose.model('chats', chatSchema);
module.exports = Chat
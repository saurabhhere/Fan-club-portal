const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    chatRoomImage: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    admin: [{
        type: Schema.Types.ObjectId,
        ref: 'users'    
    }]
     ,
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'chats',
        default: []
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: []
    }],
    activeUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: []
    }],
    activity: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

const Chatrooms = mongoose.model('chatrooms', chatRoomSchema);

module.exports = Chatrooms;

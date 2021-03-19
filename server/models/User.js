const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    ProfileUpdated: {
        type: Boolean,
        default: false
    },
    hobbies: {
        type: String,
        // required: true
    },
    socialLink: {
        type: String
    },
    favouriteChar: {
        type: String,
        // required: true
    },
    favouriteShow: {
        type: String,
        // required: true
    },
    aboutMe: {
        type: String
    },
    chatrooms: [{
        type: Schema.Types.ObjectId,
        ref: 'chatrooms',
        default: []
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'chats',
        default:[]
    }],
    activity: {
        type: Number,
        default: 0,
    }
}, {timestamps: true})

const Users = mongoose.model('users', userSchema);

module.exports = Users;
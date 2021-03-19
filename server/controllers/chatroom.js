const Chatrooms = require('../models/Chatroom');
const Users = require('../models/User');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/chatRoomPhoto');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        return cb(res.status(400).end('Only jpeg, jpg, png are allowed', false));
    }
}

const upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter: fileFilter}).single("chatRoomImage");


exports.createChatroom = async (req, res) => {
    try {
        const {name, desc, admin} = req.body;
        const obj = {
            name: name,
            chatRoomImage: req.file ? req.file.path : "uploads/chatRoomPhoto/2021-03-11T14:31:35.546Zdefaultavatar.jpg",
            desc: desc,
            admin: admin,
            messages: [],
            members: []
        }
        if (!name || !desc){
            return res.status(400).json({
                msg: "Name and Description are compulsory."
            });
        }
        const newChatRoom = new Chatrooms(obj);
        await newChatRoom.save();
        const updatedUser = await Users.findByIdAndUpdate(admin,{
            $push: {
                chatrooms: newChatRoom._id
            }
        }) 

        res.status(201).json(newChatRoom);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.getAllChatroom = async (req, res) => {
    try {
        Chatrooms.find()
        .populate("admin")
        .populate("messages")
        .populate("members")
        .exec((err, chatrooms) => {
            if (err) return res.status(400).json({error: err.message});
            res.status(200).json(chatrooms);
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.chatRoomDetail = async (req, res) => {
    try {
        const {chatRoomId} = req.params;
        Chatrooms.findById(chatRoomId)
        .populate("admin")
        .populate("members")
        .exec((err, chatroom) => {
            if (err) return res.status(400).json({error: err.message});
            res.status(201).json(chatroom)
        })
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.makeAdmin = async (req, res) => {
    const memberId = req.query.memberId;
    const chatroomId = req.query.chatroomId;
    try {
        const updatedRoom = await Chatrooms.findByIdAndUpdate(chatroomId, {
            $push: {
                admin: memberId
            },
            $pull: {
                members: memberId
            }
        })
        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.updateChatroom = async (req ,res) => {
    const {id} = req.params;
    let {name, desc} = req.body;
    try {
        const updatedChatroom = await Chatrooms.findByIdAndUpdate(id, {
            name: name,
            desc: desc  
        })
        Chatrooms.findById(id)
        .populate("admin")
        .populate("members")
        .exec((err, chatroom) => {
            if (err) return res.status(400).json({error: err.message});
            res.status(201).json(chatroom)
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    } 
}

exports.uploadPhoto = async (req, res) => {
    try {
        upload(req, res, err => {
            if (err){
                return res.status(400).json({success: false, err});
            }
            return res.status(200).json({success: true, url: res.req.file.path})
        })
    } catch (error) {
        res.status(400).json(error.message);
    }
}

exports.updateChatroomImage = async (req, res) => {
    const {id} = req.params;
    let {name, desc, chatRoomImage} = req.body;
    try {
        const updatedChatroom = await Chatrooms.findByIdAndUpdate(id, {
            name: name,
            desc: desc,
            chatRoomImage: chatRoomImage
        })
        Chatrooms.findById(id)
        .populate("admin")
        .populate("members")
        .exec((err, chatroom) => {
            if (err) return res.status(400).json({error: err.message});
            res.status(201).json(chatroom)
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    } 
}
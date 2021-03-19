const router = require('express').Router();
const Chat = require('../models/Chat');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/messageContent');
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
}, fileFilter: fileFilter}).single("chatImage");


router.get("/getChats", (req, res) => {
    Chat.find({})
    .populate("sender")
    .exec((err, chats) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({chats: chats});
    })
});

router.post("/uploadFile", async (req, res) => {
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
})

module.exports = router;
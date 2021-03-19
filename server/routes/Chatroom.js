const router = require('express').Router();
const auth = require('../middleware/auth');
const {getAllChatroom, createChatroom, chatRoomDetail, makeAdmin, updateChatroom, uploadPhoto, updateChatroomImage} = require('../controllers/chatroom');

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
        cb(null, false);
    }
}

const upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter: fileFilter});


router.get('/getAll', getAllChatroom);
router.post('/create', upload.single('chatRoomImage'),createChatroom);
router.get('/details/:chatRoomId', chatRoomDetail);
router.put('/makeAdmin', makeAdmin);
router.put("/update/:id", updateChatroom);
router.put("/updateImage/:id", updateChatroomImage);
router.post("/uploadPhoto", uploadPhoto);


module.exports = router;

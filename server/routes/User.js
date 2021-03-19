const router = require('express').Router();
const auth = require('../middleware/auth');
const {register, login, activateAccount, googlelogin, deleteUser, checkToken, getUser, getProfile, updateProfile, joinChatRoom, userChatroom, addChatroom, getAllUsers} = require('../controllers/user');


router.post('/register', register);
router.post("/login", login);
router.post('/email-activate', activateAccount)
router.post('/googlelogin', googlelogin);
router.delete("/delete", auth, deleteUser);
router.post("/tokenIsValid", checkToken);
router.get("/", auth, getUser);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/joinRoom", joinChatRoom);
router.get("/chatroom/:userId", userChatroom);
router.put("/addChatroom", addChatroom);
router.get("/all", getAllUsers);

module.exports = router;
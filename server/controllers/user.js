const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {OAuth2Client} = require('google-auth-library');
const Chatrooms = require('../models/Chatroom');
const keys = require('../config/keys');

const client = new OAuth2Client(`${keys.google.clientID}`);

exports.register = async (req, res) => {
    try {
        let { registerUsername, registerEmail, registerPassword, registerCheckPassword } = req.body;
        console.log(req.body);


        // validate
        if (!registerUsername || !registerEmail || !registerPassword || !registerCheckPassword) {
            return res.status(400).json({
                msg: "Not all fields have been entered."
            });
        }
        if (registerPassword.length < 5) {
            return res.status(400).json({
                msg: "The password needs to be atleast 5 characters long"
            });
        }
        if (registerPassword != registerCheckPassword) {
            return res.status(400).json({
                msg: "Enter the same password twice for verification"
            })
        }
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(registerEmail).toLowerCase()))) {
            return res.status(400).json({
                msg: "Invalid Email"
            })
        }

        const existingUser = await Users.findOne({ email: registerEmail });
        if (existingUser) {
            res.status(400).json({
                msg: "An account with this email already exists"
            });
        }

        const token = jwt.sign({ registerUsername, registerEmail, registerPassword }, process.env.JWT_SECRET, { expiresIn: '20m' });

        let transporter = nodemailer.createTransport({
            service: "Yahoo",
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mail = `
            <h2>Please click on given link to activate your account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>    
        `

        let mailOptions = {
            from: '"Fan Club Portal" <no-reply@fanclubportal.com>',
            to: registerEmail,
            subject: "Account Activation",
            html: mail
        }


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent:', info.messageId);
            res.status(200).json({ message: "Email has been sent, kindly activate your account" });
        })

        // const salt = await bcrypt.genSalt();
        // const passwordHash = await bcrypt.hash(registerPassword, salt);
        // const newUser = new Users({
        //     username: registerUsername,
        //     email: registerEmail,
        //     password: passwordHash
        // });
        // const savedUser = await newUser.save();
        // res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        // validate
        if (!loginEmail || !loginPassword) {
            return res.status(400).json({
                msg: "Not all fields have been entered."
            })
        };
        const user = await Users.findOne({ email: loginEmail });
        if (!user) {
            return res.status(400).json({
                msg: "No account with this email has been registered"
            });
        }
        console.log('login', req.body);
        const isMatch = await bcrypt.compare(loginPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }
        // we can add expiresIn parameter in sec
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token, user: {
                id: user._id,
                username: user.username
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.activateAccount = async (req, res) => {
    try {
        console.log("activate account", req.body);
        const { token } = req.body;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err){
                    return res.status(400).json({ error: "Incorrect or expired Link." })
                }
                const { registerUsername, registerEmail, registerPassword } = decodedToken;
                const existingUser = await Users.findOne({ email: registerEmail });
                if (existingUser) {
                    res.status(400).json({
                        msg: "An account with this email already exists"
                    });
                }
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(registerPassword, salt);
                const newUser = new Users({
                    username: registerUsername,
                    email: registerEmail,
                    password: passwordHash
                });
                const savedUser = await newUser.save();
                res.status(200).json(savedUser);
            })
        } else {
            return res.json({ error: "Error in verifying account. Please try again" })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

exports.googlelogin = async (req, res) => {
    try {
        const {tokenId} = req.body;
        client.verifyIdToken({idToken: tokenId, audience:`${keys.google.clientID}`})
        .then(async (response) => {
            const {email_verified, name, email, at_hash} = response.payload;
            if (email_verified){
                const user = await Users.findOne({ email: email });
                if (user) {
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
                    res.json({
                    token, 
                    user: {
                    id: user._id,
                    username: user.username
                    }
                    })
                } else {
                    let registerPassword = at_hash;
                    const salt = await bcrypt.genSalt();
                    const passwordHash = await bcrypt.hash(registerPassword, salt);
                    const newUser = new Users({
                        username: name,
                        email: email,
                        password: passwordHash
                    });
                    const savedUser = await newUser.save();
                    const token = await jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
                    res.status(200).json({
                        token, 
                        user: {
                        id: savedUser._id,
                        username: savedUser.username
                    }
                    })
                }
        }
        // console.log(response.payload);
    })
    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await Users. findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.checkToken = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json(false);
        }
        const user = await Users.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getUser = async(req, res) => {
    const user = await Users.findById(req.user);
    res.json({
        username: user.username,
        id: user._id
    })
}

exports.getProfile = async(req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        Users.findById(id).populate('chatrooms').exec((err, chatrooms) => {
            if (err) return res.status(400).send(err.message);
            console.log(chatrooms);
            res.status(200).json(chatrooms);
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.updateProfile = async(req, res) => {
    const {id} = req.params;
    let {hobbies, socialLink, favouriteChar, favouriteShow, aboutMe} = req.body;
    console.log("Update",req.body)
    try {
        const updatedUser = await Users.findByIdAndUpdate(id, {
            ProfileUpdated: true,
            hobbies: hobbies,
            socialLink: socialLink,
            favouriteChar: favouriteChar,
            favouriteShow: favouriteShow,
            aboutMe: aboutMe
        })
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.joinChatRoom = async (req, res) => {
    const {userId, roomId} = req.body;
    try {
        const addChatRoom = await Users.findByIdAndUpdate(userId, {
            chatrooms: [...chatrooms, roomId]
        })
        res.status(200).json(addChatRoom);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.userChatroom = async (req, res) => {
    const {userId} = req.params;
    try {
        const userChatroom = await Users.findById(userId);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.addChatroom = async (req, res) => {
    const userId = req.query.userId;
    const chatroomId = req.query.chatroomId;
    console.log(userId, chatroomId);
    try {
        const checkChatroom = await Users.findById(
            userId
        )
        console.log("checkChatroom",checkChatroom.chatrooms.indexOf(chatroomId));
        if (checkChatroom.chatrooms.indexOf(chatroomId) == -1){
            const updatedUser = await Users.findByIdAndUpdate(userId, {
                $push : {
                    chatrooms: chatroomId
                }
            })
            const updatedChatroom = await Chatrooms.findByIdAndUpdate(chatroomId, {
                $push: {
                    members: userId
                }
            })
            res.status(201).json({updatedUser, updatedChatroom});
        } else {
            res.status(201).json("Already joined this room!");
        }
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(201).json(users);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}
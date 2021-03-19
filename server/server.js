const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

const usersRoute = require('./routes/User');
const chatsRoute = require('./routes/Chat');
const chatRoomRoute = require('./routes/Chatroom');

const Chat = require('./models/Chat');
const Chatrooms = require('./models/Chatroom');
const Users = require('./models/User');

app.disabled('x-powered-by');

app.use(express.json());
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  methods: "GET, POST, PUT, PATCH, DELETE",
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

app.use('/chatroom', chatRoomRoute);
app.use('/chat', chatsRoute);
app.use('/user', usersRoute);

app.use('/', (req, res) => {
  res.send('Fan Club Portal server is Running')
})

const connect = mongoose.connect(process.env.CONNECTION_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`
)))
  .catch((error) => console.log(`${error} did not connect`));


io.on('connection', (socket) => {
  console.log('Socket connected!')
  socket.on('join', async ({ userData, roomId }, callback) => {
    const chatroom = await Chatrooms.findById(roomId);
    if (chatroom.activeUsers.indexOf(userData.user.id) == -1) {
      const updateChatroom = await Chatrooms.findByIdAndUpdate(roomId, {
        $push: {
          activeUsers: userData.user.id
        }
      });
    }
    socket.join(roomId);

    Chatrooms.findById(roomId)
      .populate('activeUsers')
      .populate('messages')
      .exec((err, chatroom) => {
        if (err) return console.log("error", err.message);
        // Send active users from here
        io.to(roomId).emit('roomData', { room: roomId, users: userData, chatroom: chatroom, activeUsers: chatroom.activeUsers });
        // Send msg from db 
        socket.emit('messageReceived', { messageFromDb: chatroom.messages });
      })

    // If you want to sent who joined
    // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    // All other people in the room
    // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    callback();
  });

  socket.on('sendMessage', async ({ userId, userName, chatMessage, roomId, type }, callback) => {
    const obj = {
      message: chatMessage,
      username: userName,
      sender: userId,
      type: type
    }
    const newMsg = new Chat(obj);
    await newMsg.save();
    const chatroom = await Chatrooms.findById(roomId);
    const updatedChatroom = await Chatrooms.findByIdAndUpdate(roomId, {
      $push: {
        messages: newMsg._id
      },
      activity: Math.ceil((chatroom.messages.length + 1) / ((parseInt(new Date().getTime() / (1000 * 60 * 60 * 24)).toFixed(0)) - (parseInt(new Date(chatroom.createdAt).getTime() / (1000 * 60 * 60 * 24)).toFixed(0)) + 1))
    })
    const user = await Users.findById(userId);
    const updatedUser = await Users.findByIdAndUpdate(userId, {
      $push: {
        messages: newMsg._id
      },
      activity: Math.ceil((user.messages.length + 1) / ((parseInt(new Date().getTime() / (1000 * 60 * 60 * 24)).toFixed(0)) - (parseInt(new Date(user.createdAt).getTime() / (1000 * 60 * 60 * 24)).toFixed(0)) + 1))
    })
    io.to(roomId).emit('message', { username: userName, message: chatMessage, updatedAt: newMsg.updatedAt, sender: userId, type: type });
  });

  socket.on('removeUser', async ({ userData, roomId }) => {
    const chatroom = await Chatrooms.findById(roomId);
    if (chatroom.activeUsers.indexOf(userData.user.id) != -1) {
      const updateChatroom = await Chatrooms.findByIdAndUpdate(roomId, {
        $pull: {
          activeUsers: userData.user.id
        }
      });
    }
    Chatrooms.findById(roomId)
      .populate('activeUsers')
      .populate('messages')
      .exec((err, chatroom) => {
        if (err) return console.log("error", err.message);
        // Send active users from here
        io.to(roomId).emit('roomData', { room: roomId, users: userData, chatroom: chatroom, activeUsers: chatroom.activeUsers });
        // Send msg from db 
      })
  })

  socket.on('disconnect', () => {
    console.log('Socket closed');
  })
});

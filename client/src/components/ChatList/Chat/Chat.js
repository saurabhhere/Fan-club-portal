import React, { useEffect, useState } from 'react'
import './Chat.css'
import axios from 'axios';
import url from '../../../misc/url';

const Chat = ({searchRoom, userData}) => {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${url.serverURL}/user/profile/${userData.user.id}`,{ cancelToken: source.token })
        .then((res) => {
            setRooms(res.data.chatrooms.filter((chatroom) => {
                if (chatroom.name.toLowerCase().includes(searchRoom.toLowerCase())){
                    return chatroom;
                }
            }));
        })
        .catch((error) => {
            console.log(error);
        })
        return () => {
            source.cancel();
          };
    }, [userData.user, searchRoom])

    return (
        <div>
        {rooms.map((room) => (
        <a key={room._id} href={`/room/${room._id}`}>
            <div className="chatlist-chat">
                <div className="chat-name">{room.name}</div>
                <div className="chat-membercount">Members: {room.members.length + room.admin.length}</div>
            </div>
        </a>
        ))}
        </div>
    )
}

export default Chat

import React, { useEffect, useState, useContext } from 'react'
import './ChatRoomAvailable.css';
import axios from 'axios'
import url from '../../misc/url';
import Hamburger from '../Hamburger-menu/Hamburger';
import userContext from '../../context/userContext';
import Login from '../Login/Login';
import { toast } from 'react-toastify';

const ChatRoomAvailable = () => {

    const [chatRooms, setchatRooms] = useState([])
    const [searchRoom, setSearchRoom] = useState('');
    

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${url.serverURL}/chatroom/getAll`,{ cancelToken: source.token })
            .then((res) => {
                setchatRooms(res.data.filter((chatroom) => {
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
    }, [searchRoom])

    const {userData, setUserData} = useContext(userContext);


    const addUserToChatroom = (chatroom) => {
        const source = axios.CancelToken.source();

        axios.put(`${url.serverURL}/user/addChatroom?userId=${userData.user.id}&chatroomId=${chatroom}`, { cancelToken: source.token })
        .then((res) => {
            if (res.data == "Already joined this room!"){
                alreadyJoinedRoomToast();
            } else {
                newRoomJoinedToast();
            }
        }).catch((error) => {
            console.log(error);
        })
        source.cancel();

    }

    const alreadyJoinedRoomToast = () => {
        toast.error('Already Joined this room!', {position: toast.POSITION.TOP_CENTER})
    }

    const newRoomJoinedToast = () => {
        toast.success('New Chatroom Added!', {position: toast.POSITION.TOP_CENTER});
    }


    return (
        <div className="chatroom-available">
            {userData.user ? (
                <>
            <Hamburger />
            <div className="chatroom-available-flex">
                <div className="chatroom-available-heading">Available Chatrooms</div>
                <div className="chatlist-search" >
                    <input type="text" placeholder="Search Chatroom" value={searchRoom} onChange={e => setSearchRoom(e.target.value)}/>
                </div>
                <div className="chatroom-available-body">
                    {chatRooms.map((chatroom) => (
                        <div className="chatroom-available-chat" key={chatroom._id}>
                            <div>
                                <div className="chatroom-available-chat-name">{chatroom.name}</div>
                                <div className="chatroom-available-chat-member">{chatroom.name}</div>
                            </div>
                            <div className="chatroom-available-chat-creator">Created By: {chatroom.admin[0].username}</div>
                            <div onClick={() => addUserToChatroom(chatroom._id)} value={chatroom._id} className="chatroom-avaiable-chat-follow-btn">Follow</div>
                        </div>
                    ))}
                </div>
            </div>
            </>
        ) : (
            <Login />
        )}
        </div>
    )
}

export default ChatRoomAvailable

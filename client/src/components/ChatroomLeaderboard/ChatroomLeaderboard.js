import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/userContext'
import url from '../../misc/url'
import Hamburger from '../Hamburger-menu/Hamburger'
import Login from '../Login/Login'
import './ChatroomLeaderboard.css'

const ChatroomLeaderboard = () => {

    const [chatRooms, setchatRooms] = useState([]);

    const [searchRoom, setSearchRoom] = useState('');

    const {userData, setUserData} = useContext(userContext);

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${url.serverURL}/chatroom/getAll`, { cancelToken: source.token })
            .then((res) => {
                setchatRooms(res.data.sort(
                    (a,b) => {return b.activity - a.activity}
                ).filter((chatroom) => {
                    if (chatroom.name.toLowerCase().includes(searchRoom.toLowerCase())){
                        return chatroom;
                    }
                })
                );
            })
            .catch((error) => {
                console.log(error);
            })
            return () => {
                source.cancel();
            };
    },[searchRoom])

    return (
        <>
        {userData.user ? (
            <div className="chatroom-leaderboard">
            <div className="chatroom-available">
            <Hamburger />
            <div className="chatroom-available-flex">
                <div className="chatroom-available-heading">Chatroom Leaderboard</div>
                <div className="chatlist-search" >
                    <input type="text" placeholder="Search Chatroom" value={searchRoom} onChange={e => setSearchRoom(e.target.value)}/>
                </div>
                <div className="chatroom-available-body">
                    {chatRooms.map((chatroom) => (
                        <div className="chatroom-available-chat" key={chatroom._id}>
                            <div>
                                <div className="chatroom-available-chat-name">{chatroom.name}</div>
                            </div>
                                <div className="chatroom-available-chat-creator">Group Activity: {chatroom.activity} msg/day</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        ):(
            <Login />
        )}
        </>
    )
        }


export default ChatroomLeaderboard

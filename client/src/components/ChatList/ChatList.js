import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import userContext from '../../context/userContext';
import axios from 'axios';
import url from '../../misc/url';
import Hamburger from '../Hamburger-menu/Hamburger';
import Chat from './Chat/Chat';
import './ChatList.css'
import Login from '../Login/Login';

const ChatList = () => {

    const [user, setUser] = useState('');
    const [searchRoom, setSearchRoom] = useState('');

    const { userData, setUserData } = useContext(userContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user) {
            axios.get(`${url.serverURL}/user/profile/${userData.user.id}`)
                .then((res) => {
                    if (!res.data.ProfileUpdated) {
                        history.push(`/user/profile/${userData.user.id}`)
                    }
                    setUser(res.data);
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [userData])

    return (
        <div className="chatlist">
            {userData.user ? (
                <>
                    <Hamburger />
                    <div className="chatlist-flex">
                        <div className="chatlist-heading">Chats</div>
                        <div className="chatlist-search" >
                            <input type="text" value={searchRoom} onChange={e => setSearchRoom(e.target.value)} placeholder="Search Chatroom" />
                        </div>
                        <Chat searchRoom={searchRoom} userData={userData}/>
                    </div>
                </>
            ) : (
                <>
                    <Login />
                </>
                )}
        </div>
    )
}

export default ChatList

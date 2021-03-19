import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/userContext'
import url from '../../misc/url'
import Hamburger from '../Hamburger-menu/Hamburger'
import Login from '../Login/Login'
import './UserLeaderboard.css';

const UserLeaderboard = () => {

    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    const {userData, setUserData} = useContext(userContext);


    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${url.serverURL}/user/all`, { cancelToken: source.token })
            .then((res) => {
                setUsers(res.data.sort(
                    (a,b) => {return b.activity - a.activity}
                ).filter((user) => {
                    if (user.username.toLowerCase().includes(searchUser.toLowerCase())){
                        return user;
                    }
                }));
            })
            .catch((err) => {
                console.log(err);
            })
            return () => {
                source.cancel("Component unmounted, request is cancelled.");
            };
    },[searchUser]);

    return (
        <div>
          {userData.user ? (
            <div className="chatroom-leaderboard">
            <div className="chatroom-available">
            <Hamburger />
            <div className="chatroom-available-flex">
                <div className="chatroom-available-heading">Users Leaderboard</div>
                <div className="chatlist-search" >
                    <input type="text" placeholder="Search Chatroom" value={searchUser} onChange={e => setSearchUser(e.target.value)}/>
                </div>
                <div className="chatroom-available-body">
                    {users.map((user) => (
                        <div className="chatroom-available-chat" key={user._id}>
                            <div>
                                <div className="chatroom-available-chat-name">{user.username}</div>
                            </div>
                                <div className="chatroom-available-chat-creator">Activity: {user.activity} msg/day</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        ):(
            <Login />
        )}  
        </div>
    )
}

export default UserLeaderboard

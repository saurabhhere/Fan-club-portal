import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import url from '../../../misc/url';
import './Members.css'

const Members = ({chatroom, userDetail, members, admin}) => {

    const [user, setUser] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setUser(userDetail);
        if (admin){
            admin.map((adminMap) => {
                if (user.user){
                    if (adminMap._id == user.user.id){
                        setIsAdmin(true);
                    } 
                }
            })
        }
    })

    const makeAdmin = (memberId) => {
        axios.put(`${url.serverURL}/chatroom/makeAdmin?memberId=${memberId}&chatroomId=${chatroom._id}`)
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="chatroom-members">
        {admin ? (
            <>
            <div className="chatroom-members-heading">MEMBERS ({members.length + admin.length})</div>
            <div className="chatroom-members-body">
            {admin.map((user) => (
                <Link key={user._id} to={`/user/profile/${user._id}`}>
                    <div className="chatroom-member">
                        <div className="chatroom-member-name">{user.username} {true && "(Admin)"}</div>
                    </div>
                </Link>
            ))}
            {members.map((member) => (
                <div key={member._id} className="chatroom-member-container">
                <Link to={`/user/profile/${member._id}`}>
                    <div className="chatroom-member">
                        <div className="chatroom-member-name">{member.username} {false && "(Admin)"}</div>
                    </div>
                </Link>
                    <div className={isAdmin ? "make-admin-btn-show" : "make-admin-btn-hide"} onClick={() => makeAdmin(member._id)}>Make admin</div>
                </div>
            ))}
            </div>
            </>
        ): ('')}
        </div>
    )
}

export default Members

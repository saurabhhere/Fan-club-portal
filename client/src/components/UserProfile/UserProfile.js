import React, { useContext, useEffect, useState } from 'react'
import './UserProfile.css'
import axios from 'axios';
import url from '../../misc/url';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import userContext from '../../context/userContext';
import Hamburger from '../Hamburger-menu/Hamburger';
import Login from '../Login/Login';

const UserProfile = () => {

    const [user, setUser] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [socialLink, setSocialLink] = useState('')
    const [favouriteChar, setFavouriteChar] = useState('');
    const [favouriteShow, setFavouriteShow] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const {userData, setUserData} = useContext(userContext);

    const {userId} = useParams();

    const history = useHistory();

    useEffect(() => {
        const source = axios.CancelToken.source();

        if (userData.user){
            axios.get(`${url.serverURL}/user/profile/${userId}`, { cancelToken: source.token })
            .then((res) => {
                setUser(res.data);
                if (res.data.ProfileUpdated){
                    setHobbies(res.data.hobbies);
                    setSocialLink(res.data.socialLink);
                    setFavouriteChar(res.data.favouriteChar);
                    setFavouriteShow(res.data.favouriteShow);
                    setAboutMe(res.data.aboutMe);
                }
            }).catch((err) => {
                console.log(err);
            })

        }
        return () => {
            source.cancel();
          };
    }, [userData, userId])

    const submit = async (e) => {
        e.preventDefault();
        const updateUser = { hobbies, socialLink, favouriteChar, favouriteShow, aboutMe};
        axios.put(`${url.serverURL}/user/profile/${user._id}`,updateUser)
            .then((res) => {
                history.push("/");

            }).catch((err) => {
                console.log(err);
            })
    }


    return (
        <>
        {user.ProfileUpdated ? <Hamburger /> : ''}
        <div className="profile-container">
        {userData.user ? (
            <div className="profile">
            <h1 className="profile-heading">{user.username}'s Profile</h1>
            <form onSubmit={submit}>
                <div className="profile-flex">
                    <div className="profile-adjacent-flex">
                        <div>
                            <div>
                                <label>Username</label>
                            </div>
                            <div>
                                <input type="text" id="read-only-input" placeholder={user.username} readOnly />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Email</label>
                            </div>
                            <div>
                                <input type="text" id="read-only-input" placeholder={user.email} readOnly />
                            </div>
                        </div>
                    </div>
                    <hr className="profile-hr"/>
                    <div className="profile-adjacent-flex">
                        <div>
                            <div>
                                <label>Hobbies</label>
                            </div>
                            {userData.user.id == userId ? (
                            <input type="text" onChange={e => setHobbies(e.target.value)} id="hobbies" value={hobbies} required  />
                            ) : (
                            <input type="text"id="hobbies" placeholder={hobbies} readOnly/>
                            )}
                        </div>
                        <div>
                            <div>
                                <label>Social Link to Connect (Optional)</label>
                            </div>
                            {userData.user.id == userId ? (
                            <input type="text" onChange={e => setSocialLink(e.target.value)} id="socialprofile" value={socialLink}/>
                            ) : (
                            <input type="text" id="socialprofile" placeholder={socialLink} readOnly/>
                            )}
                        </div>
                    </div>
                    <div className="profile-adjacent-flex">
                        <div>
                            <div>
                                <label>Favourite Character</label>
                            </div>
                            {userData.user.id == userId ? (
                            <input type="text" onChange={e => setFavouriteChar(e.target.value)} id="favChar" value={favouriteChar} required />
                            ) : (
                            <input type="text" id="favChar" placeholder={favouriteChar} readOnly />
                            )}
                        </div>
                        <div>
                            <div>
                                <label>Favourite Show</label>
                            </div>
                            {userData.user.id == userId ? (
                            <input type="text" onChange={e => setFavouriteShow(e.target.value)} value={favouriteShow} required />
                            ) : (
                            <input type="text" placeholder={favouriteShow} readOnly />
                            )}
                        </div>
                    </div>
                    <div className="profile-adjacent-flex">
                        <div>
                        <div>
                            <label>About Me</label>
                        </div>
                        {userData.user.id == userId ? (
                            <textarea type="text" onChange={e => setAboutMe(e.target.value)} value={aboutMe} required/>
                            ) : (
                            <textarea type="text" placeholder={aboutMe} readOnly/>
                            )}
                        </div>
                    </div>
                    <div className="profile-adjacent-flex">
                            Chatrooms Joined:
                        {user ? (user.chatrooms.map((chatroom, i) => (
                                <div key={i}>{chatroom.name} |</div>
                            ))) : ('No Chatrooms Joined')}
                    </div>
                    <div className="profile-adjacent-flex">
                    {userData.user.id == userId ? (<input type="submit" value="Update Profile"/>) : ('')}
                    </div>
                </div>
            </form>
            </div>
        ) : (
            <Login />
        )}

        
        </div>
        </>
    )
}

export default UserProfile

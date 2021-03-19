import React, { useContext, useEffect, useState } from 'react'
import './Hamburger.css'
import { Link } from 'react-router-dom';
import CreateNewChat from '../CreateNewChat/CreateNewChat';
import userContext from '../../context/userContext';

const Hamburger = () => {

    const[modalIsOpen, setModalIsOpen] = useState(false);
    const {userData, setUserData} = useContext(userContext);

    
    const modalOpen = (e) => {
        setModalIsOpen(true);
        const top = document.querySelector('#top');
        top.classList.toggle("top-transition");
        const meat = document.querySelector('#meat');
        meat.classList.toggle("meat-transition");
        const bottom = document.querySelector('#bottom');
        bottom.classList.toggle("bottom-transition");
        const menu = document.querySelector('#nav-options');
        menu.classList.toggle('menu1-transition-close');
    }

    const optionsShow = (e) => {
        const top = document.querySelector('#top');
        top.classList.toggle("top-transition");
        const meat = document.querySelector('#meat');
        meat.classList.toggle("meat-transition");
        const bottom = document.querySelector('#bottom');
        bottom.classList.toggle("bottom-transition");
        const menu = document.querySelector('#nav-options');
        menu.classList.toggle('menu1-transition-close');
    }


    return (
        <div>
            <section className="p-menu1">
                <nav id="navbar" className="navigation" role="navigation">
                    <div onClick={optionsShow} className="hamburger1" htmlFor="toggle1">
                        <div id="top"></div>
                        <div id="meat"></div>
                        <div id="bottom"></div>
                    </div>
                    {userData.user ? (
                    <nav id="nav-options" className="menu1-transition-open menu1-transition-close">
                        <Link to={`/user/profile/${userData.user.id}`} className="hamburger-option">My Profile</Link>
                        <div onClick={modalOpen} className="hamburger-option">Create new Chat</div>
                        <Link to="/room/available" className="hamburger-option">View all Chat</Link>
                        <Link to="/chatroom/leaderboard" className="hamburger-option">Chatroom Leaderboard</Link>
                        <Link to="/user/leaderboard" className="hamburger-option">User Leaderboard</Link>
                    </nav>

                    ) : (
                        ""
                    )}
                </nav>
            </section>
            <div className="Modal">
                <CreateNewChat modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                </div>
        </div>
    )
}

export default Hamburger

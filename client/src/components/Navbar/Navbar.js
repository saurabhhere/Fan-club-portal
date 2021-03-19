import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import userContext from '../../context/userContext'
import './Navbar.css'
import Logo from './logoFC.png';
import { toast } from 'react-toastify';

const Navbar = () => {

    const { userData, setUserData } = useContext(userContext);

    const history = useHistory();

    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token","");
        history.push("/user/login");
        notify();
    };

    const notify = () => {
        toast.info('Successfully Logged out!', {position: toast.POSITION.TOP_CENTER});
    }

    return (
        <div className="navbar">
            {userData.user ? (
                <>  
            <Link to="/" className="logo">
                <img src={Logo} alt="Logo" />
            </Link>
                        <div className="FCP">
                        FAN CLUB PORTAL
                        </div>
                    <div className="navbar-options-flex">
                        <div className="navbar-option">
                            <Link to="/">
                                Home
                            </Link>
                        </div>
                        <div onClick={logout} className="navbar-option">
                            Logout
                        </div>
                    </div>
                </>
            ) : (
                    <> 
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                    </>
                )}
        </div>
    )
}

export default Navbar

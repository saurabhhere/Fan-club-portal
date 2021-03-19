import React, { useContext, useEffect, useState } from 'react'
import url from '../../misc/url';
import './Login.css'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import userContext from '../../context/userContext';
import GoogleLogin from 'react-google-login';
import { toast } from 'react-toastify';
import keys from '../keys';

const Login = () => {

    const [loginEmail, setloginEmail] = useState('');
    const [loginPassword, setloginPassword] = useState('');
    const [registerUsername, setregisterUsername] = useState('')
    const [registerEmail, setregisterEmail] = useState('')
    const [registerPassword, setregisterPassword] = useState('')
    const [registerCheckPassword, setregisterCheckPassword] = useState('')
    const [error, setError] = useState('');
    
    const history = useHistory();
    
    const { setUserData } = useContext(userContext);

    useEffect(() => {
        const img__btn = document.querySelector('.sub-cont .img__btn');
        img__btn.addEventListener('click', () => {
            document.querySelector('.cont').classList.toggle('s--signup');
        })
    }, [])

    const submitLogin = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { loginEmail, loginPassword };
            const loginResponse = await axios.post(`${url.serverURL}/user/login`, loginUser);
        setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user
        });
        localStorage.setItem("auth-token", loginResponse.data.token);
        history.push("/");
        } catch (error) {
            console.log(error);
            if (error.response){
                setError(error.response.data.msg)
            } else {
                console.log(error);
            }
        }
    }

    const submitRegister = async (e) => {
        e.preventDefault();
        try {
            const newUser = { registerUsername, registerEmail, registerPassword, registerCheckPassword};
            await axios.post(`${url.serverURL}/user/register`, newUser).then(res => {
                console.log(res);
                notifyUser();
            });
        } catch (error) {
            console.log(error.response);
            if (error.response){
                setError(error.response.data.msg)
            } else {
                console.log(error);
            }
        }
    }

    const responseSuccessGoogle = async (response) => {
        await axios.post(`${url.serverURL}/user/googlelogin`, {tokenId: response.tokenId})
        .then((res) => {
            setUserData({
                token: res.data.token,
                user: res.data.user
                });
                localStorage.setItem("auth-token", res.data.token);
                history.push("/");
        })
    }

    const responseErrorGoogle = async (error) => {
        // console.log(error.details);
    }

    const notifyUser = () => {
        toast.info('Please check your mail', {position: toast.POSITION.TOP_CENTER});
    }

    return (
        <div className="signup">
            <div className="cont">
                <div className="form sign-in">
                    <div>
                        <h2>Welcome back,</h2>
                        <div className="form-error">
                            {error}
                </div>
                        <label>
                            <span>Email</span>
                            <input type="email" onChange={e => setloginEmail(e.target.value)} value={loginEmail} required />
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" onChange={e => setloginPassword(e.target.value)} value={loginPassword} required />
                        </label>
                        <button type="button" onClick={submitLogin} className="submit">Sign In</button>
                        <GoogleLogin
                                clientId={keys.clientId}
                                buttonText="Login With Google" 
                                onSuccess={responseSuccessGoogle}
                                onFailure={responseErrorGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        {/* <button type="button" className="fb-btn">Connect with <span className="google-text-1">G</span><span className="google-text-2">O</span><span className="google-text-3">O</span><span className="google-text-4">G</span><span className="google-text-5">L</span><span className="google-text-6">E</span></button> */}
                    </div>
                </div>
                <div className="sub-cont">
                    <div className="img">
                        <div className="img__text m--up">
                            <h2>New here?</h2>
                            <p>Sign up here!</p>
                        </div>
                        <div className="img__text m--in">
                            <h2>One of us?</h2>
                            <p>If you already has an account, just sign in. We've missed you!</p>
                        </div>
                        <div className="img__btn">
                            <span className="m--up">Sign Up</span>
                            <span className="m--in">Sign In</span>
                        </div>
                    </div>
                    <div className="form sign-up">
                        <div>
                            <h2>Time to feel like home,</h2>
                            <div className="form-error">
                                {error}
                            </div>
                            <label>
                                <span>Username</span>
                                <input type="text" onChange={e => setregisterUsername(e.target.value)} value={registerUsername} required />
                            </label>
                            <label>
                                <span>Email</span>
                                <input type="email" onChange={e => setregisterEmail(e.target.value)} value={registerEmail} required />
                            </label>
                            <label>
                                <span>Password</span>
                                <input type="password" onChange={e => setregisterPassword(e.target.value)} value={registerPassword} required />
                            </label>
                            <label>
                                <span>Confirm Password</span>
                                <input type="password" onChange={e => setregisterCheckPassword(e.target.value)} value={registerCheckPassword} required />
                            </label>
                            <button type="button" onClick={submitRegister} className="submit">Sign Up</button>
                            <GoogleLogin
                                clientId="390537836145-o7hv2vp97a3j1qdeiobg5ct192dpigeg.apps.googleusercontent.com"
                                buttonText="Connect with Google" 
                                onSuccess={responseSuccessGoogle}
                                onFailure={responseErrorGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                            {/* <button type="button" className="fb-btn">Connect with <span className="google-text-1">G</span><span className="google-text-2">O</span><span className="google-text-3">O</span><span className="google-text-4">G</span><span className="google-text-5">L</span><span className="google-text-6">E</span></button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

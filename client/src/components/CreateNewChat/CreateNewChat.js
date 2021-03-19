import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal';
import {AiOutlineCloseSquare} from 'react-icons/ai';
import './CreateNewChat.css';
import userContext from '../../context/userContext';
import axios from 'axios';
import url from '../../misc/url';
import { useHistory } from 'react-router-dom';

const CreateNewChat = ({modalIsOpen, setModalIsOpen}) => {

    const [name, setName] = useState('');
    const [chatRoomImage, setChatRoomImage] = useState('');
    const [desc, setDesc] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState('');
    const {userData, setUserData} = useContext(userContext);

    const history = useHistory();

    useEffect(() => {
        if (userData.user){
            setUser(userData);
        }
    })

    const fileSelectHandler = (e) => {
        e.preventDefault();
        setChatRoomImage(e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            const admin = userData.user.id;
    
            const formData = new FormData();
            formData.append("name", name);
            formData.append("chatRoomImage", chatRoomImage);
            formData.append("desc", desc);
            formData.append("admin", admin);            

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
    
            await axios.post(`${url.serverURL}/chatroom/create`, formData, config).then((res) => {
                if (res) {
                    history.push("/");
                    window.location.reload();
                    setModalIsOpen(false);                    
                }
            })

        } catch (err) {
            console.log(err);
            if (err.response){
                setError(err.response.data.msg);
            }
        }
    };

    return (
        <Modal className="getBook-modal" isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={
                    {
                        overlay: {
                            backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                    }
                }
            >
                <div className="modal-close-btn" onClick={() => setModalIsOpen(false)}><AiOutlineCloseSquare /></div>
                <div className="getBook-modal-flex">
                    <div className="getBook-modal-heading">Enter Chatroom Details</div>
                    <div className="form-error">{error}</div>
                    <div className="wrapper">
                        <form onSubmit={submit}>
                            <div className="group">
                                <input type="text" required="required" onChange={e => setName(e.target.value)} value={name}/><span className="highlight"></span><span className="bar"></span>
                                <label>Name</label>
                            </div>
                            <div className="group">
                                <input type="text" required="required" onChange={e => setDesc(e.target.value)} value={desc}/><span className="highlight"></span><span className="bar"></span>
                                <label>Short Desc</label>
                            </div>
                            <div className="group">
                                <input onChange={fileSelectHandler} filename="chatRoomImage" type="file"/><span className="highlight"></span><span className="bar"></span>
                                <label>Picture</label>
                            </div>
                            <div className="btn-box">
                                <button className="btn btn-submit" type="submit">submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
    )
}

export default CreateNewChat

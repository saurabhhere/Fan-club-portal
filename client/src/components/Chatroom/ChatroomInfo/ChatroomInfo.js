import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal';
import url from '../../../misc/url';
import {AiOutlineCloseSquare} from 'react-icons/ai';
import userContext from '../../../context/userContext';
import './ChatroomInfo.css';
import Dropzone from 'react-dropzone';

const ChatroomInfo = ({roomId,  modalIsOpen, setModalIsOpen}) => {

    const [chatroomInfo, setChatroomInfo] = useState('');
    const { userData, setUserData } = useContext(userContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        const source = axios.CancelToken.source();

        setUser(userData);
        axios.get(`${url.serverURL}/chatroom/details/${roomId}`, { cancelToken: source.token })
            .then((res) => {
                setChatroomInfo(res.data);
                setName(res.data.name);
                setDesc(res.data.desc);
                if (res.data.admin){
                    res.data.admin.map((adminMap) => {
                        if (user.user){
                            if (adminMap._id == user.user.id){
                                setIsAdmin(true);
                            } 
                        }
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
            return () => {
                source.cancel();
            };
    },[roomId, modalIsOpen])

    const submit = () => {
        const updateChatroom = {name, desc};
        axios.put(`${url.serverURL}/chatroom/update/${chatroomInfo._id}`, updateChatroom)
            .then((res) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const fileDrop = (files) => {

        let formData = new FormData;
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        formData.append("chatRoomImage", files[0]);
        axios.post(`${url.serverURL}/chatroom/uploadPhoto`, formData, config)
        .then((res) => {
            if (res.data.success){
                let chatRoomImage = res.data.url;
                const updateChatroom = {name, desc, chatRoomImage}
                axios.put(`${url.serverURL}/chatroom/updateImage/${chatroomInfo._id}`, updateChatroom)
                .then((res) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                })
            }
        })
    }

    return (
        <Modal isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}>
            <div className="modal-close-btn" onClick={() => setModalIsOpen(false)}><AiOutlineCloseSquare/></div>
            <div className="chatroom-info-heading">Chatroom Info</div>
            <div className="chatroom-info-all-flex">
            {isAdmin ? (
                <div className="chatroom-info-flex">
                    <div className="chatroom-info-edit-flex">
                        <div className="chatroom-info-input">
                            <div className="chatroom-info-input-label">Name</div>
                            <input type="text" onChange={e => setName(e.target.value)} id="name" value={name} required />
                        </div>
                        <div className="chatroom-info-input">
                            <div className="chatroom-info-input-label">Description</div>
                            <textarea onChange={e => setDesc(e.target.value)} id="desc" value={desc} required/>
                        </div>
                    </div>
                    <div className="chatroom-info-image">
                        <img src={`${url.serverURL}/${chatroomInfo.chatRoomImage}`} />
                    <div className="chatroom-info-image-btn">
                    <Dropzone onDrop={fileDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input filename="chatRoomImage" {...getInputProps()} />
                                        Update Image
                                    </div>
                                </section>
                            )}
                    </Dropzone>
                    </div>
                    </div>
                </div>
            ) : (
                <>
                <div className="chatroom-info-flex">
                    <div className="chatroom-info-edit-flex">
                    <div>
                            <div className="chatroom-info-input-label">Name</div>
                            <div>{name}</div>
                        </div>
                        <div>
                            <div className="chatroom-info-input-label">Description</div>
                            <div>{desc}</div>
                        </div>
                    </div>
                    <div className="chatroom-info-image">
                        <img src={`${url.serverURL}/${chatroomInfo.chatRoomImage}`} />
                    </div>
                </div>
                </>
            )}
            {chatroomInfo ? (
                <>
            <div className="chatroom-info-flex-bottom">
                <div className="chatroom-info-option">Admin: {chatroomInfo.admin.length  }</div>
                <div className="chatroom-info-option">Member: {chatroomInfo.members.length ? chatroomInfo.members.length : 0}</div>
            </div>
            <div className="chatroom-info-flex-bottom">
                <div className="chatroom-info-option">Activity: {chatroomInfo.activity} msg/day</div>
                <div className="chatroom-info-option">Created on: {new Date(chatroomInfo.createdAt).toDateString()}</div>
            </div>
            <div onClick={submit} className={isAdmin ? "chatroom-info-btn-show" : "chatroom-info-btn-hide"}>
                Update Chatroom
            </div>
                </>
            ) : ('')}
            </div>
        </Modal>
    )
}

export default ChatroomInfo

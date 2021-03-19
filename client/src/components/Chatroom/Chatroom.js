import React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import userContext from '../../context/userContext';
import './Chatroom.css'
import { serverURL } from '../../misc/url';
import io from 'socket.io-client';
import moment from 'moment';
import ChatCard from './ChatCard/ChatCard';
import axios from 'axios';
import Members from './Members/Members';
import { BsUpload } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import url from '../../misc/url';
import Dropzone from 'react-dropzone';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import ChatroomInfo from './ChatroomInfo/ChatroomInfo';
import {VscLoading} from 'react-icons/vsc';

const socket = io(`${serverURL}`, { transports: ['websocket'], upgrade: false });

const Chatroom = (props) => {

    const [users, setUsers] = useState();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userDetail, setUserDetail] = useState('');
    const [chatRoomDetails, setChatRoomDetails] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [diffInDays, setDiffInDays] = useState('');

    const { userData, setUserData } = useContext(userContext);
    const[modalIsOpen, setModalIsOpen] = useState(false);

    const { roomId } = useParams();
    const chatroomRef = useRef();

    useEffect(() => {
        if (chatroomRef.current) {
            chatroomRef.current.scrollTop = chatroomRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (userData.user) {
            setUserDetail(userData);
        }
    }, [userData, userDetail])


    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${url.serverURL}/chatroom/details/${roomId}`, { cancelToken: source.token })
            .then((res) => {
                setChatRoomDetails(res.data);
                setImageURL(res.data.chatRoomImage);
                setDiffInDays((parseInt(new Date().getTime()/(1000*60*60*24)).toFixed(0))-parseInt(new Date(res.data.createdAt).getTime()/(1000*60*60*24)).toFixed(0)+1);
            }).catch((error) => {
                console.log(error);
            })

        return () => {
            source.cancel("Component unmounted, request is cancelled.");
        };
    }, [roomId])

    useEffect(() => {
        if (socket.id && userData.user) {
            socket.emit('join', { userData, roomId }, (error) => {
                // console.log(error);
            });
        }
        return () => {
            if (socket.id && userData.user) {
                socket.emit('removeUser', { userData, roomId });
            }
        }
    }, [userData, roomId]);

    useEffect(() => {
        socket.on('message', (msg) => {
            setMessages([...messages, msg]);
        });
        socket.on('roomData', ({ chatroom, users, activeUsers }) => {
            setUsers(activeUsers);
        });
        socket.on('messageReceived', ({ messageFromDb }) => {
            setMessages(messageFromDb);
        });
        return (() => {
            socket.removeAllListeners();
        })
    }, [messages, users])

    const modalOpen = (e) => {
        setModalIsOpen(true);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        let chatMessage = input;
        let userId = userDetail.user.id;
        let userName = userDetail.user.username;
        let nowTime = moment();
        let type = "text";
        socket.emit('sendMessage', {
            chatMessage,
            userId,
            userName,
            nowTime,
            roomId,
            type
        });
        setInput('');
    }

    const fileDrop = (files) => {

        let formData = new FormData;

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        formData.append("chatImage", files[0]);
        axios.post(`${url.serverURL}/chat/uploadFile`, formData, config)
        .then((res) => {
            if (res.data.success){
                let chatMessage = res.data.url;
                let userId = userDetail.user.id;
                let userName = userDetail.user.username;
                let nowTime = moment();
                let type = "image";
        socket.emit('sendMessage', {
            chatMessage,
            userId,
            userName,
            nowTime,
            roomId,
            type
        });
            }
        })
    }

    return (
        <>
            {userData.user && messages ? (
                <div className="chatroom-container">
                    <div className="chatroom">
                        <div className="chat_header">
                            <div className="chat-img"><img src={`${url.serverURL}/${imageURL}`} /></div>
                            <div className="chat_headerInfo">
                                <h3>{chatRoomDetails.name}</h3>
                                <p>Last Activity {moment(chatRoomDetails.updatedAt).fromNow()}</p>
                            </div>
                            <div className="chatroom-info">
                                <div onClick={modalOpen}><AiOutlineInfoCircle /></div>
                            </div>
                        </div>

                        <div ref={chatroomRef} id="chat-body" className="chat_body">
                            {messages.map((chat, i) => (
                                <ChatCard userId={userDetail.user.id} key={i} chat={chat} />
                            ))}
                        </div>

                        <div className="chat_footer">
                            <form>
                                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text" />
                                <button onClick={sendMessage} type="submit">Send a message</button>
                            </form>
                            <div className="upload-btn">
                                <Dropzone onDrop={fileDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input filename="chatImage" {...getInputProps()} />
                                                <BsUpload id="upload-btn-icon"/>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                    <div className="chatroom-right-flex">
                        <Members chatroom={chatRoomDetails} userDetail={userDetail} members={chatRoomDetails.members} admin={chatRoomDetails.admin} />
                        <div className="chatroom-active-members">
                            <div className="chatroom-members-heading">ONLINE</div>
                            {users ? (
                                <>
                                    {users.map((user) => (
                                        <div key={user._id} className="chatroom-member">
                                            <div className="chatroom-member-name">{user.username}</div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                    <></>
                                )}
                        </div>
                    </div>
                    <div className="Modal">
                <ChatroomInfo roomId={roomId} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                </div>
                </div>
            ) : (
                <div className="loading">
                            <VscLoading/> Loading Chatroom...
                </div>
                )}
        </>
    )
}

export default Chatroom

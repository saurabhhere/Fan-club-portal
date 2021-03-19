import React from 'react'
import moment from 'moment';
import url from '../../../misc/url';

const ChatCard = ({userId, chat}) => {

    return (
        <>
        <p className={`chat_message ${userId==chat.sender && "chat_receiver"}`}>
        <span className="chat_name">{chat.username}</span>
        {chat.type=="text" ? (
            <>
            {chat.message}
            </>
        ):(
            <img src={`${url.serverURL}/${chat.message}`} alt="Image"/>
        )}
        <span className="chat_timestamp">
            {moment(chat.updatedAt).fromNow()}
        </span>
    </p>
    </>
    )
}

export default ChatCard

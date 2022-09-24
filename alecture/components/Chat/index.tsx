import React, {VFC} from "react";
import {IDM} from "@typings/db";
import {ChatWrapper} from "./styles";
import gravatar from "gravatar";

interface Props {
    data: IDM;
}

const Chat: VFC<Props> = ({data}) => {
    const user = data.Sender;
    return (
        <ChatWrapper>
            <div className="chat-img">
                <img src={gravatar.url(user.email, {s: '36px', d: 'retro'})} alt={user.nickname}/>
            </div>
            <div className="chat-text">
                <div className="chat-user">
                    <b>{user.nickname}</b>
                    <span>{data.createdAt}</span>
                </div>
            </div>
            <p>{data.content}</p>
        </ChatWrapper>
    );
};

export default Chat;
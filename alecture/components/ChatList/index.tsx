import React, {FC, VFC} from "react";
import { ChatZone, Section } from "./styles";
import {IDM} from "@typings/db";

interface Props {
    chatData: IDM[];
}

const ChatList : VFC<Props> = ({chatData}) => {

    return(
        <ChatZone>
            {chatData.map((chat)=>(
                <Chat key={chat.id} data={chat}/>
            ))}
        </ChatZone>
    );
};

export default ChatList;
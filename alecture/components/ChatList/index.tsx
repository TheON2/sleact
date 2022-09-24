import React, {FC, useCallback, useRef, VFC} from "react";
import {ChatZone, Section} from "./styles";
import {IDM} from "@typings/db";
import Chat from "@components/Chat";
import {Scrollbars} from 'react-custom-scrollbars';

interface Props {
    chatData?: IDM[];
}

const ChatList: VFC<Props> = ({chatData}) => {
    const scrollbarsRef = useRef(null);
    const onScroll = useCallback(()=>{

    },[]);

    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollbarsRef} onScrollFrame={onScroll}>
                {chatData?.map((chat) => (
                    <Chat key={chat.id} data={chat}/>
                ))}
            </Scrollbars>
        </ChatZone>
    );
};

export default ChatList;
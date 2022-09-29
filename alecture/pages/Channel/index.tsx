import React, {useCallback} from 'react'
import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/Channel/styles";
import useInput from "@hooks/useInput";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";

const Channel = () => {
    const [chat, onChangeChat , setChat] = useInput('');

    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        setChat('');
    },[]);

    return (
    <Container>
        <Header>
            채널!
        </Header>
        {/*<ChatList/>*/}
        <ChatBox chat={chat} onSubmitForm={onChangeChat} onChangeChat={onSubmitForm}/>
    </Container>
    );
}

export default Channel;
import Workspace from "@layouts/Workspace";
import React, {useCallback} from "react";

import gravatar from "gravatar";
import {Container, Header } from "./styles";
import useSWR from "swr";
import {IUser} from "@typings/db";
import fetcher from "@utils/fetcher";
import {useParams} from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const DirectMessage = () => {
    const { workspace , id } = useParams<{workspace: string ,id: string}>();
    const { data: userData, error, revalidate, mutate} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
        dedupingInterval: 2000, // 2초
    },);
    const { data : myData } = useSWR('/api/users',fetcher);
    const [chat, onChangeChat] = useInput('');

    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
    },[]);

    if( !userData || !myData){
        return null;
    }

    return(
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, { s: '24px',})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </Header>
            <ChatList/>
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
}

export default DirectMessage;
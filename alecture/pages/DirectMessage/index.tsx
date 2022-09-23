import Workspace from "@layouts/Workspace";
import React, {useCallback} from "react";

import gravatar from "gravatar";
import {Container, Header } from "./styles";
import useSWR from "swr";
import {IDM, IUser} from "@typings/db";
import fetcher from "@utils/fetcher";
import {useParams} from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";

const DirectMessage = () => {
    const { workspace , id } = useParams<{workspace: string ,id: string}>();
    const { data: userData, error, mutate} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
        dedupingInterval: 2000, // 2초
    },);
    const { data : myData } = useSWR('/api/users',fetcher);
    const { data : chatData,mutate: mutateChat,revalidate } = useSWR<IDM[]>(
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,fetcher);
    const [chat, onChangeChat , setChat] = useInput('');

    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        if (chat?.trim()) {
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
                content:chat,
            }).then(()=>{
                revalidate();
                setChat('');
            }).catch(console.error);
        }
    },[chat]);

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
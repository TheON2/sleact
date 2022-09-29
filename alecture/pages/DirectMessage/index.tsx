import Workspace from "@layouts/Workspace";
import React, {useCallback, useEffect, useRef} from "react";

import gravatar from "gravatar";
import {Container, Header} from "./styles";
import useSWR, {useSWRInfinite} from "swr";
import {IDM, IUser} from "@typings/db";
import fetcher from "@utils/fetcher";
import {useParams} from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
    const {workspace, id} = useParams<{ workspace: string, id: string }>();
    const {data: userData, error, mutate} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
        dedupingInterval: 2000, // 2초
    },);
    const {data: myData} = useSWR('/api/users', fetcher);
    const {data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`, fetcher);

    const [chat, onChangeChat, setChat] = useInput('');

    const isEmpty = chatData?.[0]?.length === 0;
    // isEmpty = chatData를 수신 성공하고 , 첫배열에 데이터가 존재할때 , 그 길이가 0인가?
    // 인피니트 스크롤로 더 읽어올 chatData가 남은지에 대한 true , false 값을 저장하는 변수
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const scrollbarRef = useRef<Scrollbars>(null);
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        if (chat?.trim() && chatData) {
            const savedChat = chat;
            mutateChat((prevChatData)=>{
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    SenderId: myData.id,
                    Sender: myData,
                    ReceiverId: userData.id,
                    Receiver: userData,
                    content: savedChat,
                    createdAt: new Date(),
                });
                return prevChatData;
            },false)
            .then(()=>{
                setChat('');
                scrollbarRef.current?.scrollToBottom();
            });
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                content: chat,
            }).then(() => {
                revalidate();
            }).catch(console.error);
        }
    }, [chat,chatData, myData, userData, workspace , id]);

    // 로딩 시 스크롤바 제일 아래로
    useEffect(()=>{
        if(chatData?.length === 1){
            scrollbarRef.current?.scrollToBottom();
        }
    },[chatData]);

    if (!userData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s: '24px',})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize}
                      isReachingEnd={isReachingEnd}/>
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
}

export default DirectMessage;
import React, {useCallback, useEffect, useRef, useState} from 'react'
import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/Channel/styles";
import useInput from "@hooks/useInput";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import {useParams} from "react-router";
import useSWR, {useSWRInfinite} from "swr";
import fetcher from "@utils/fetcher";
import {IChannel, IChat, IUser} from "@typings/db";
import useSocket from "@hooks/useSocket";
import Scrollbars from "react-custom-scrollbars";
import axios from "axios";
import makeSection from "@utils/makeSection";
import gravatar from "gravatar";
import InviteChannelModal from "@components/InviteChannelModal";

const Channel = () => {
    const {workspace, channel} = useParams<{ workspace: string, channel: string }>();
    const {data: myData} = useSWR('/api/users', fetcher);
    const {data: channelData} = useSWR<IChannel>(`api/workspaces/${workspace}/channels/${channel}`, fetcher);
    const {
        data: chatData,
        mutate: mutateChat,
        revalidate,
        setSize
    } = useSWRInfinite<IChat[]>((index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`, fetcher);
    const {data: channelMembersData} = useSWR<IUser[]>(myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher,);
    const [socket] = useSocket(workspace);
    const [chat, onChangeChat, setChat] = useInput('');

    const isEmpty = chatData?.[0]?.length === 0;
    // isEmpty = chatData를 수신 성공하고 , 첫배열에 데이터가 존재할때 , 그 길이가 0인가?
    // 인피니트 스크롤로 더 읽어올 chatData가 남은지에 대한 true , false 값을 저장하는 변수
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const scrollbarRef = useRef<Scrollbars>(null);
    const [showInviteChannelModal , setShowInviteChannelModal] = useState(false);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        if (chat?.trim() && chatData && channelData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    UserId: myData.id,
                    User: myData,
                    ChannelId: channelData.id,
                    Channel: channelData,
                    content: savedChat,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false)
                .then(() => {
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
            axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
                content: chat,
            }).then(() => {
                revalidate();
            }).catch(console.error);
        }
    }, [chat, chatData, myData, channelData, workspace, channel]);

    const onMessage = useCallback((data: IChat) => {
        if (data.Channel.name === channel && data.UserId !== myData?.id) {
            mutateChat((chatData) => {
                chatData?.[0].unshift(data);
                return chatData;
            }, false).then(() => {
                if (scrollbarRef.current) {
                    if (
                        scrollbarRef.current.getScrollHeight() <
                        scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
                    ) {
                        console.log('scrollToBottom!', scrollbarRef.current?.getValues());
                        setTimeout(() => {
                            scrollbarRef.current?.scrollToBottom();
                        }, 50);
                    }
                }
            });
        }
    }, [channel, myData]);

    useEffect(() => {
        socket?.on('message', onMessage);
        return () => {
            socket?.off('message', onMessage);
        }
    }, [socket, onMessage]);


    // 로딩 시 스크롤바 제일 아래로
    useEffect(() => {
        if (chatData?.length === 1) {
            scrollbarRef.current?.scrollToBottom();
        }
    }, [chatData]);

    const onClickInviteChannel = useCallback(() => {
        setShowInviteChannelModal(true);
    }, []);

    const onCloseModal = useCallback(()=>{
        setShowInviteChannelModal(false);
    },[]);

    if (!myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        <Container>
            <Header>
                <span>#{channel}</span>
                <div className="header-right">
                    <span>{channelMembersData?.length}</span>
                    <button
                        onClick={onClickInviteChannel}
                        className="c-button-unstyled p-ia__view_header__button"
                        aria-label="Add people to #react-native"
                        data-sk="tooltip_parent"
                        type="button"
                    >
                        <i className="c-icon p-ia__view_header__dutton_icon c-iicon--add-user" aria-hidden="true"/>
                    </button>
                </div>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize}
                      isReachingEnd={isReachingEnd}/>
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
            <InviteChannelModal
                show={showInviteChannelModal}
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}
            />
        </Container>
    );
}

export default Channel;
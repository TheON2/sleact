import React, {FC, useCallback, useState} from 'react';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from 'axios';
import {Redirect, Route, Switch} from "react-router";
import {
    AddButton,
    Channels, Chats,
    Header, LogOutButton, MenuScroll,
    ProfileImg, ProfileModal,
    RightMenu, WorkspaceButton,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import {Link} from 'react-router-dom';
import {IUser} from "@typings/db";
import Modal from "../../../front/components/Modal";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));


const Workspace: FC = ({children}) => {
    const {
        data: userData,
        error,
        revalidate,
        mutate
    } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
        dedupingInterval: 2000, // 2초
    });
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true,
        })
            .then((response) => {
                mutate(false, false);
            })
    }, []);

    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    if (!userData) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.email, {s: '28px', d: 'retro'})}
                                    alt={userData.nickname}></ProfileImg>
                        {showUserMenu && (
                            <Menu style={{right: 0, top: 30}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(userData.email, {s: '36px', d: 'retro'})} alt=""/>
                                    <div>
                                        <span id={"profile-name"}>{userData.nickname}</span>
                                        <span id={"profile-active"}>Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>
                        )}
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>menu scroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel}/>
                        <Route path="/workspace/dm" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <Label id="workspace-label">
                    <span>워크스페이스 이름</span>
                    <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                </Label>
                <Label id="workspace-url-label">
                    <span>워크스페이스 이름</span>
                    <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                </Label>
            </Modal>
            {children}
        </div>
    );
};

export default Workspace;
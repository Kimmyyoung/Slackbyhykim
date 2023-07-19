import React, { VFC, useCallback, useState, useEffect } from "react";
import axios from 'axios';
import useSWR from 'swr';
import fetcher from "@utils/fetcher";
import Modal  from "@components/Modal";
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast } from 'react-toastify';

import { Header, RightMenu, ProfileImg, WorkspaceWrapper, 
    Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, 
    LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from "@layouts/Workspace/style";
import gravatar from 'gravatar';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import loadable from "@loadable/component";
import { IChannel,IUser } from "@typings/db";
import CreateChannelModal from "@components/CreateChannelModal";
import { useParams } from "react-router";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";
import useSocket from "@hooks/useSocket";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Menu = loadable(()=>import('@components/Menu'));

//Children 이 필요 없는 Component 의 경우 : VFC
const Workspace : VFC = ()=>{
    const { workspace } = useParams<{ workspace: string }>();
    const  {data:userData, error, mutate :revalidateUser} = useSWR('/api/users', fetcher, {
        dedupingInterval: 2000,
    });
    console.log(userData);
    const { data: channelData} = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);


    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal,setShowCreateChannelModal] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal,setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    //socket
    const [socket, disconnect] = useSocket(workspace);

    useEffect(()=>{
      if(channelData && userData && socket) {
          socket.emit('login', {id: userData.id, channels: channelData.map((v:IChannel)=>v.id)})
      }
    });
    useEffect(()=>{
        return ()=>{
            disconnect();
        }
    },[workspace, disconnect]);

    const onCreateWorkspace = useCallback(
        (e) => {
          e.preventDefault();
          if (!newWorkspace || !newWorkspace.trim()) {
            return;
          }
          if (!newUrl || !newUrl.trim()) {
            return;
          }
          axios
            .post('/api/workspaces', {
              workspace: newWorkspace,
              url: newUrl,
            })
            .then(() => {
              revalidateUser();
              setShowCreateWorkspaceModal(false);
              setNewWorkspace('');
              setNewUrl('');
            })
            .catch((error) => {
              console.dir(error);
              toast.error(error.response?.data, { position: 'bottom-center' });
            });
        },
        [newWorkspace, newUrl],
      );

    const onLogOut = useCallback(() => {
        //localhost 의 url 은 최대한 안적어 주는 것이 좋음 
        axios
          .post('/api/users/logout')
          .then(() => {
            revalidateUser();
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
          });
      }, []);

    const onClickUserProfile = useCallback(()=>{
        //toggle function (토글 함수 : 껐다 켰다 해주는 함수)
        setShowUserMenu((prev)=> !prev)
    },[]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback(()=> {
        setShowWorkspaceModal((prev)=>!prev);
    }, []);

    const onClickAddChannel = useCallback((prev)=>{
        setShowCreateChannelModal((prev) => !prev);
    }, []);

    const onClickInviteWorkspace = useCallback(()=>{
        setShowInviteWorkspaceModal(true);
    },[]);

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData, { s: '28px', d: 'retro'})} alt={userData} />
                        {showUserMenu && 
                        <Menu style={{right: 0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(userData.nickname, { s: '28px', d: 'retro'})} alt={userData.nickname} />
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogOut}>Logout</LogOutButton>
                        </Menu>}
                        {/* 컴포넌트를 나누는 기준 : 재사용 (1순위) 단일 사용 */}
                    </span>
                </RightMenu>
            </Header>            
        <WorkspaceWrapper>
            <Workspaces>Test</Workspaces>
            <Channels>
                <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
                <MenuScroll>
                    <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95, left:80}}>
                            {/* Component 중 스타일이 조금 다를때, style 을 custom 해줄 수 있다. : For that, need to set up style prop and type in Component */}
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>Invite Member</button>
                                <button onClick={onClickAddChannel}>Add Channel</button>
                                <button onClick={onLogOut}>Logout</button>
                            </WorkspaceModal>
                    </Menu> 

                    <ChannelList />
                    <DMList />
                    
                </MenuScroll>
            </Channels>

            <Chats>
                <Switch>
                    <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
                    <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
                </Switch>   
            </Chats>
            {/* page sprit */}
        </WorkspaceWrapper>

        <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateWorkspace}>
                <Label id="workspace-label">
                    <span>Workspace Name</span>
                    <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                </Label>
                <Label id="workspace-url-label">
                    <span>Workspace URL</span>
                    <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                </Label>
                <Button type="submit">Submit</Button>
            </form>
        </Modal>

        <CreateChannelModal 
        show={showCreateChannelModal} 
        onCloseModal={onCloseModal} 
        setShowCreateChannelModal={setShowCreateChannelModal} 
        />

        <InviteWorkspaceModal 
        show={showInviteWorkspaceModal} 
        onCloseModal={onCloseModal} 
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal} />

        <InviteChannelModal 
        show={showInviteChannelModal} 
        onCloseModal={onCloseModal} 
        setShowInviteChannelModal={setShowInviteChannelModal} />


        </div>
    )
};

export default Workspace;
import React, { useCallback } from "react";
import { Container, Header } from "@pages/DirectMessage/styles";
import gravatar from 'gravatar';
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import useSWR from 'swr';
import ChatBox from "@components/ChatBox";
import useInput from "@hooks/useInput";
import ChatList from "@components/ChatList";
import axios from "axios";
import { IDM } from "@typings/db";

const DirectMessage = ()=> {
    const {workspace, id} = useParams<{workspace: string, id: string}>();

    const {data: userData} = useSWR(`/api/workspace/${workspace}/users/${id}`, fetcher);
    const {data: myData} = useSWR('/api/users',fetcher);
    const {data:chatData, mutate:mutateChat} = useSWR<IDM[]>(()=>`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,fetcher);

    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        if(chat?.trim()){
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
                content: chat,
            })
            .then(()=>{
                mutateChat();
                setChat('');
            })
            .catch(console.error);
        }
    },[chat]);

    if(!userData || !myData) {return null;}

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, { s: '24px', d: 'retro'})} alt={userData.nickname} />
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatData={chatData}/>
            <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} placeholder='message'/>
        </Container>
    );
};

export default DirectMessage;
function useSWRInfinite<T>(arg0: (index: any) => string, fetCher: any): { data: any; mutate: any; setSize: any; } {
    throw new Error("Function not implemented.");
}


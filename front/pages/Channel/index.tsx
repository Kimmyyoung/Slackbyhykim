import React, { useCallback } from "react";
import { Container, Header  } from "@pages/Channel/style";
import ChatBox from "@components/ChatBox";
import useInput from "@hooks/useInput";
import ChatList from "@components/ChatList";

const Channel = ()=>{
    const [chat, onChangeChat] = useInput('');

    const onSubmitForm = useCallback((e)=>{

    },[]);    return (
        <Container>
            <Header>Channel!</Header>
            {/* <ChatList /> */}
            <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
        </Container>
    )
}


export default Channel;

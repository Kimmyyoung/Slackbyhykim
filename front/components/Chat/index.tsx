import React, { VFC } from "react";
import {IDM} from '@typings/db';
import { ChatWrapper } from "./styles";
import gravatar from 'gravatar';
import dayjs from "dayjs";

interface Props{
    data:IDM;
};
const Chat: VFC<Props> = ({data})=>{
    const user = data.Sender;

    return (
       <ChatWrapper>
           <div className="chat-img">
               <img src={gravatar.url(user.email, { s: '36px', d: 'retro'})} alt={user.nickname} />
           </div>

           <div className="chat-text">
               <div className="chat-user">
                   <b>{user.nickname}</b>
                   <span>{dayjs(data.createdAt).format('h:mm A')}</span>
                   {/* 대표적인 다른 라이브러리 : moment */}
               </div>
               <p>{data.content}</p>
           </div>
       </ChatWrapper> 
    )
};

export default Chat;
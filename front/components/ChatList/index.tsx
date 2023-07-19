import React, { useCallback, useRef, VFC, forwardRef } from "react";
import {ChatZone, Section, StickyHeader} from '@components/ChatList/styles';
import Chat from "@components/Chat";
import { IDM, IChat } from "@typings/db";
import {Scrollbars} from 'react-custom-scrollbars';

interface Props {
    isReachingEnd?: boolean;
    isEmpty: boolean;
    chatSections: { [key: string]: (IDM | IChat)[] };
    setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
};

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, scrollRef) => {
    const onScroll = useCallback((values)=>{
        if(values.scrollTop === 0 && !isReachingEnd){
            console.log('가장 위');
            //Adding more data
            setSize((prevSize)=>prevSize+1).then(()=>{
                //keep scroll position
            })
        }
    },[]);

    return (
        <ChatZone>
        <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
          {Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
        </Scrollbars>
      </ChatZone>
    );
});

export default ChatList;




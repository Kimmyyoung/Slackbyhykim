import React, { useCallback, useRef, VFC, forwardRef } from "react";
import {ChatZone, Section, StickyHeader} from '@components/ChatList/styles';
import Chat from "@components/Chat";
import { IDM } from "@typings/db";
import {Scrollbars} from 'react-custom-scrollbars';

interface Props {
    chatSections: {[key: string] : IDM[]};
    setSize : (f: (size: number)=> number)=> Promise<IDM[][] | undefined>;
    isEmpty: boolean;
    isReachingEnd: boolean;
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
                        {/* position : Sticky  */}
                        {chats.map((chat)=>{
                        <Chat key={chat.id} data={chat} />
                        })}
                    </Section>
                )
            })}
            </Scrollbars>
        </ChatZone>
    );
});

export default ChatList;




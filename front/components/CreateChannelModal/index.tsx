import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import axios from 'axios';
import { useParams } from 'react-router';
import { IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal : (flag: boolean) => void;
}
const CreateChannelModal : VFC<Props> = ({show, onCloseModal,setShowCreateChannelModal})=>{
    const[newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
        // Parameter 에 있는 자리 데이터를 useParams hook을 통해서 가져오고, 서버가 어느 것인지 정확히 데이터를 구분한다.

        const  {data:userData, mutate :revalidateUser} = useSWR('http://localhost:3095/api/users', fetcher, 
        {
            dedupingInterval: 2000,
        });

        const { data: channelData, mutate:revalidateChannels } = useSWR<IChannel[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, fetcher);
        
        const onCreateChannel = useCallback((e)=> {
        e.preventDefault(); //새로고침 방지
          axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
                name: newChannel,
            },{
                withCredentials: true,
            }).then(()=>{
                setShowCreateChannelModal(false);
                revalidateChannels();
                setNewChannel('');
            }).catch((err)=>{
                console.dir(err.response?.data, {position: 'bottom-center'})
            });
    }, [newChannel]);

    
    return (
        <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
            <Label id="channel-label">
                <span>Channel Name</span>
                <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
            </Label>
            <Button type="submit">Submit</Button>
        </form>
     </Modal>
    )
};

export default CreateChannelModal;

// function useSWR<T>(arg0: string | null, fetcher: any): { data: any; } {
//     throw new Error('Function not implemented.');
// }

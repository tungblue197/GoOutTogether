import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import http from 'api/http';
import { Group } from 'types/group';
import axios from 'axios';
import React from 'react';
import TextInput from 'components/input';
import { getSessionPage } from 'constants/urls'
import Button from 'components/button';
import {useCountdownTimer} from 'use-countdown-timer';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import { User } from 'types/user';
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { checkLogin } from 'helpers/auth'
import { useCallback } from 'react';
export default function Session({
    group
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const locations = JSON.parse(group.locations);
    const [usersJoined, setUsersJoined] = useState<User[]>([]);
    const [currentVotes, setCurrentVotes] = useState<any[]>([]);
    const socketRef = useRef<Socket>();
    const {countdown, start, reset, pause, isRunning} = useCountdownTimer({
        timer: 30 * 1000,
        onExpire: () => {
            pause();
        }
    });
    useEffect(() => {
        start();
        connect();
        if(!checkLogin()){
            router.push('/');
            localStorage.setItem('prePath', getSessionPage(group.id));
        }
     
    }, []);

    const connect = () => {
        const socket = socketRef.current = io();
        socket.emit('join-vote', { uId: localStorage.getItem('uId'), groupId: group.Id});
        socket.on("connect", () => {

            socket.on('join-vote-success', ({ group }) => {
                setUsersJoined(group);
            });

            socket.on('user-disconected', ({usersRemaing}) => {
                console.log('user disconnect')
                setUsersJoined(usersRemaing);
            });

            socket.on('voted', ({ votes }) => {
                setCurrentVotes(votes);
            })
          });
        
    }
    const disconect = () => {
        const uId = localStorage.getItem('uId');
        const socket = socketRef.current;
        console.log(socket, 'socket here');
        if(socket){
            socket.emit('user-disconect', { uId, groupId: group.id});

        }
    }

    const handleVote = (idPlace: string) => {
        const  socket = socketRef.current;
      
        if(socket){
            const uId = localStorage.getItem('uId');
            socket.emit('vote', { uId, groupId: group.id, idPlace });
        }
    }


    
    return (
        <div className='container'>
            <div className='users-info'>
                <h4 className='text-sm text-green-600 mb-2'>Các thành viên đang online ({ usersJoined.length})</h4>
                {
                    <ul className='users-info__list'>
                        {
                            usersJoined.map((user: User) => {
                                return <li key={user.id} className='users-info__item'><FontAwesomeIcon  icon={faCircle} className='text-green-500 mr-2' fontSize={10} />{user.name}</li>
                            })
                        }
                    </ul>
                }
            </div>
            <div className='w-3/6 mx-auto py-4'>
                <div className='p-4 text-center'>
                {isRunning ? <h2 className='text-center text-red-500 text-6xl'>{countdown / 1000}s</h2> : <span className='text-sm text-red-400 text-center block'>Hết giờ địa điểm được chọn là: Hà Nội - <span className='text-blue-500'>Với 90%(5) lượt vote</span></span>}
                </div>
                <div className='text-center text-blue-500 mb-4 text-xl'>
                    <div>
                        <span>Tiêu đề: {group.title}</span>
                    </div>
                    <div>
                        <span>Nội dung: {group.content}</span>
                    </div>
                    <div>
                        <span>Được tạo bởi: {group.createdBy}</span>
                    </div>
                </div>
                <div className='flex justify-between items-center mb-4 border'>
                    <input readOnly={true} type='text' className='w-full outline-none px-2' value={getSessionPage(group.id)} />
                    <Button>Copy</Button>
                </div>
                <div className=' bg-gray-100 '>
                    <ul className="list-locations">
                        {
                            locations.map((item: any) => (
                                <li key={item.id} className="location-item flex items-center justify-between pr-4 border">
                                    <label className='flex items-center py-2 px-4'>
                                        <input type='radio' name='place' className='mr-3' value={item.id} onChange={e => {
                                            handleVote(e.target.value);
                                        }}  />
                                        {item.place_name}
                                    </label>
                                    
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}


export const getStaticProps: GetStaticProps = async (ctx) => {
    const { id } = ctx.params as any;
    const { data: { extra } } = await axios.get('http://localhost:3000/api/group');
    const group = extra.find((item: Group) => item.id === id);
    return {
        props: {
            group,
            createdUser: null
        }
    }
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    // const {paths} =  data.extra.map((item: Group) => { params: { id: item.id }})
    return {
        paths: [],
        fallback: "blocking"
    }
}
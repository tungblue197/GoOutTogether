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
import {  NotificationManager } from 'react-notifications';
import {NotificationContainer } from 'react-notifications';
import { useQuery } from 'react-query';
import { useMemo } from 'react';

export default function Session({
    group
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const locations = JSON.parse(group.locations);
    const [usersJoined, setUsersJoined] = useState<User[]>([]);
    const [winner, setWinner] = useState<any>();
    const [currentVotes, setCurrentVotes] = useState<any[]>([]);
    const socketRef = useRef<Socket>();
    const [timer, setTimer] = useState(0);
  
    useEffect(() => {

        connect();
        if(!checkLogin()){
            router.push('/');
            localStorage.setItem('prePath', getSessionPage(group.id));
        }
    }, []);



    const connect = () => {
        const socket = socketRef.current = io('http://localhost:8000');
        const uId = localStorage.getItem('uId');
        socket.on('connect', () => {

            //--> group and count
            socket.emit('join-group', { uId, gId: group.id }, ({ room}: any) => {
                setUsersJoined(room.users);
                setCurrentVotes(room.votes);
            });
            // lắng nhe sự kiện join room
            socket.on('user-joined-room', ({ user } : any) => {
                //thông báo cho tất cả mọi người người vưa join
                NotificationManager.info(user.name + 'was join session');
                console.log(user, 'user join')
                setUsersJoined([...usersJoined, user]);
            })

            socket.on('count-down',( counter: number) => {
                setTimer(counter);
            })

            socket.on('count-down-end', (winner) => {
                console.log('count-down-end', winner);
                setWinner(winner.locationId);
            })


            //--> vote

            socket.on('voted', ({votes}): any => {
                setCurrentVotes(votes);
            })
           
        });
    }
   

    const handleVote = (location: string) => {
        const  socket = socketRef.current;
      
        if(socket){
            const uId = localStorage.getItem('uId');
            socket.emit('vote', { location , gId: group.id, uId });
        }
    }

    const getNumberOfOccurrences = useCallback((idLocation: string) => {
        let n = 0;
        currentVotes.forEach(item => {
            if(item.locationId === idLocation) n++;
        });
        return n;
    }, [currentVotes])

    // const getLocationFromId = useMemo(() => { 
    //     console.log('locations : ', locations);
    //     if(winner) {
    //         return locations.find((lc: any) => lc.id === winner);
    //     }
    //     return null;
    // }, [winner,locations])

    return (
        <div className='container'>
            <NotificationContainer />
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
                {timer ? <h2 className='text-center text-red-500 text-6xl'>{timer}s</h2> : <span className='text-sm text-red-400 text-center block'>{winner} - <span className='text-blue-500'>{(100 / usersJoined.length) * getNumberOfOccurrences(winner)}% ({getNumberOfOccurrences(winner)} Votes)</span></span>}
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
                                        <input type='radio' name='place' className='mr-3' value={item.id} onClick={e => {
                                            handleVote(item);
                                        }}  />
                                        {item.place_name}
                                    </label>
                                    <div>{(100 / usersJoined.length) * getNumberOfOccurrences(item.id)}% ({getNumberOfOccurrences(item.id)} Votes)</div>
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
    if(group.win){
        return {
            redirect: {
                destination: '/sessions'
            },
            props:{

            }
        }
    }
    return {
        props: {
            group,
            createdUser: null
        },
    }
}



export const getStaticPaths: GetStaticPaths = async (ctx) => {

    // const {paths} =  data.extra.map((item: Group) => { params: { id: item.id }})
    return {
        paths: [],
        fallback: "blocking"
    }
}
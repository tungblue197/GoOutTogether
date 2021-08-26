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
import { useLayoutEffect } from 'react';

export default function Session({
    group
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const locations = JSON.parse(group.locations);
    const {countdown, start, reset, pause, isRunning} = useCountdownTimer({
        timer: 30 * 1000,
        onExpire: () => {
            pause();
        }
    });
    useLayoutEffect(() => {
        start();
    }, [])
    
    return (
        <div className='container'>
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
                    <input type='text' className='w-full outline-none px-2' value={getSessionPage(group.id)} />
                    <Button>Copy</Button>
                </div>
                <div className=' bg-gray-100 '>
                    <ul className="list-locations">
                        {
                            locations.map((item: any) => (
                                <li key={item.id} className="location-item flex items-center justify-between pr-4 border">
                                    <label className='flex items-center py-2 px-4'>
                                        <input type='radio' name='place' className='mr-3' />
                                        {item.place_name}
                                    </label>
                                    <div>90%(3 votes)</div>
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
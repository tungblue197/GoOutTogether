import React from 'react'
import { useRef } from 'react';
import { useState } from 'react'
import { useEffect } from 'react'


const useCountDown = (ms: number) => {
    const [remainingTime, setRemainingTime] = useState(0);
    let timer = useRef<any>(null);
    useEffect(() => {
        setRemainingTime(ms);
        const interval = setInterval(() => {
            setRemainingTime(remainingTime - 1);
            console.log(remainingTime)
        }, 1000);
        return () => clearInterval(interval);
    }, []);
   
    return remainingTime;
}

export default useCountDown

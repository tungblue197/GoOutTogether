import React from 'react'
import ReactLoading from 'react-loading';
import { useIsFetching }  from 'react-query';
const Loader = () => {
    const isFetching = useIsFetching();
    console.log('isFetching : ', isFetching);
    if(!isFetching) return null;
    return (
        <div className='fixed loader'>
            <ReactLoading className='loader-spiner' type='spinningBubbles' color='green' />
        </div>
    )
}

export default Loader

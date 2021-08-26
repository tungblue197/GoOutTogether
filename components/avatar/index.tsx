import React from 'react'
import Image from 'next/image';
import { images } from 'constants/Images';


export const sizes = {
    sm: 20,
    md: 32,
    lg: 60
}
export interface IAvatarProps {
    size?: 'sm' | 'md' | 'lg'
}

const Avatar: React.FC<IAvatarProps> = ({ size = 'md' }) => {

    return (
        <Image className='rounded-full cursor-poiter' src={images.user} width={sizes[size]} height={sizes[size]} />
    )
}

export default Avatar

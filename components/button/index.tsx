import React, { ButtonHTMLAttributes } from 'react'
import { useMemo } from 'react'

export interface IButtonProps{
    children?: React.ReactNode;
    onClick?: (e: any) => any;
    disable?: boolean;
}
const Button: React.FC<IButtonProps> = ({ children,onClick, disable,...rest }) => {
    const getDisableClass = useMemo(() => disable ? 'bg-gray-400 border-gray-400' : 'bg-gray-700 border-gray-700', [disable]);
    return (
        <button onClick={e => onClick && onClick(e)} {...rest} className={`flex-shrink-0 ${getDisableClass} text-sm border-4 text-white py-1 px-2 rounded`} type='button'>
            { children }
        </button>
    )
}

export default Button

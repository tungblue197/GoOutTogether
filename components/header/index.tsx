import Avatar from "components/avatar";
import React, { FC, memo } from "react";

export interface IHeaderProps {
    leftComponent?: React.Component | React.ReactNode;
    leftTitle?: string;
    centerTitle?: string;
    centerComponent?: React.Component | React.ReactNode;
    rightComponent?: React.Component | React.ReactNode;
    rightTitle?: string; 
    className?: string;
}
const Header: FC<IHeaderProps> = ({ leftComponent, centerComponent, rightComponent, className = '' , leftTitle = '', centerTitle = '',  rightTitle = '' }) => {
    return (
        <header className={`flex items-center justify-between md:px-10 h-14 bg-gray-700 header ${className}`}>
            <div className='text-white header-left'>
                {leftComponent || leftTitle}
            </div>
            <div className='text-white header-center'>
                {centerComponent || centerTitle}
            </div>
            <div className='text-white header-right'>
                {rightComponent || rightTitle}
            </div>
        </header>
    )
}

export default memo(Header);
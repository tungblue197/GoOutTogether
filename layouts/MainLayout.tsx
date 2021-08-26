import React, { ReactNode, FC } from 'react'
import Header from 'components/header'
import Avatar from 'components/avatar'


export interface IMainLayoutProps{
    children?: ReactNode 
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
    return (
        <div>
            <Header 
                leftTitle='App Cùng Đi Chơi'
                rightComponent={<Avatar />}
            />
            <div>
                {
                    children && children
                }
            </div>
        </div>
    )
}

export default MainLayout

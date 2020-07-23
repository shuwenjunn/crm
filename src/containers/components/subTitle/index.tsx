import React from 'react'
import './index.less'

interface DrawerProps {
    title: string
    rightCon?: React.ReactNode
}

const SubTitle: React.FC<DrawerProps> = (props, ref) => {
    return (
        <div className='sub-title'>

            <div className="sub-title__l">
                <div className='line'></div>
                <div className='title'>{props.title}</div>
            </div>
            <div className="sub-title__r">
                {props.rightCon}
            </div>
        </div>
    )
}

export default SubTitle
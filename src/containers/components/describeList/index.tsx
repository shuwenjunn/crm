import React from 'react'
import './index.less'

interface ItemProps {
    label: React.ReactNode | string
    value: React.ReactNode | string
}

interface Iprops {
    data: ItemProps[]
    width: number
}

const Index: React.FC<Iprops> = (props, ref) => {
    return (
        <div className='describe-list'>
            {props.data.map(d => {
                return (
                    <div key={d.label as string} className="describe-list__item" style={{width: `${props.width}%`}}>
                        <div className="item-l">
                            {d.label}
                        </div>
                        <div className="item-r">{d.value||'暂无数据'}</div>
                    </div>
                )
            })}

        </div>
    )
}

export default Index
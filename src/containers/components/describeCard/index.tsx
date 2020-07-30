import React from 'react'
import './index.less'
import classnames from 'classnames'

interface ItemProps {
    label: React.ReactNode | string
    value: React.ReactNode | string
}

interface Iline {
    isHeader?: boolean
    children: ItemProps[]
    customStyle?:any
}

export interface IdescribeCardProps {
    data: Iline[]
    bordered?: boolean
}


export const DescribeCard: React.FC<IdescribeCardProps> = (props, ref) => {

    return (
        <div className={classnames('describe-card-list', {
            bordered: props.bordered ? true : false,
        })}>
            {props.data.map((item, index) => {
                const lineClassName = classnames('line', {
                    header: item.isHeader ? true : false,
                }, {
                    bordered: props.bordered ? true : false,
                })
                return (
                    <div className={lineClassName} key={index} >
                        {item.children.map((it, idx) => (
                            <div className='item' key={idx} style={item.customStyle}>
                                <div className='label'>{it.label}</div>
                                <div className='value'>{it.value}</div>
                            </div>
                        ))}

                    </div>
                )
            })}
        </div>
    )
}
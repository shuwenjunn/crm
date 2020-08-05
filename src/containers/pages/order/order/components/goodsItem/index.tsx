import React from 'react'
import './index.less'
import classnames from 'classnames'
import { DescribeCard, IdescribeCardProps } from 'containers/components/describeCard'

interface ItemProps {
    label: React.ReactNode | string
    value: React.ReactNode | string
}

interface Iline {
    isHeader?: boolean
    children: ItemProps[]
}

interface Iprops {
    goodsDescData: IdescribeCardProps['data']
    thumbnail: string
    footer?: React.ReactNode | string
}



const Index: React.FC<Iprops> = (props, ref) => {

    return (
        <div className='goods-item-card'>
            <div className={'goods-info'}>

                <img className="thumbnail" src={props.thumbnail} />
                <div className='goods-desc'>
                    <DescribeCard
                        bordered={true}
                        data={props.goodsDescData}
                    />
                </div>
            </div>
            <div className="footer">
                {props.footer}
            </div>
        </div>
    )
}

export default Index
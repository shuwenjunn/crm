import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {Modal} from "antd";
import './index.less'

interface Iprops {
    title: string
    url: string
    customerStyle: any
}

const Index: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)

    const handlePreview = (url: string) => {
        setVisible(true)
    }

    useImperativeHandle(ref, () => ({
        handlePreview
    }))

    const handleCancel = () => setVisible(false)

    return (
        <div className='img-preview'>
            <Modal
                visible={visible}
                title={props.title}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}} src={props.url}/>
            </Modal>

            {props.url && (
                <img
                    src={props.url}
                    style={props.customerStyle}
                    onClick={handlePreview}
                />
            )}
        </div>
    )
}

export default forwardRef(Index)
import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {Drawer, Button} from 'antd'

interface DrawerProps {
    showFooter: boolean
    title: string
    width: number

    renderContent(data: any): React.ReactNode

    request(record: any): any
}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState({})
    const [data, setData] = useState({})

    const showDrawer = (record: any) => {
        setVisible(true)
        setRecord(record)
        console.log('recorddddddddd', record)
        fetchData(record)
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))


    const fetchData = async (params: any) => {

        const result = await props.request(params)
        console.log('result', result)
        setData(result.customer_info)
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={props.width}
            footer={
                props.showFooter && (
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{marginRight: 8}}>
                            Cancel
                        </Button>
                        <Button onClick={onClose} type="primary">
                            Submit
                        </Button>
                    </div>
                )
            }
        >
            {props.renderContent(data)}
        </Drawer>
    )
}

export default forwardRef(App)
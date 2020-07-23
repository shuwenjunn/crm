import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input} from 'antd';

const FormItem = Form.Item

interface Iprops {
    title: string
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState({})
    const [data, setData] = useState({})
    const [optType, setOptType] = useState('')

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)

    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = (values: any) => {

    }

    const layout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={500}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{marginRight: 8}}>
                        取消
                    </Button>
                    <Button onClick={form.submit} type="primary">
                        确认
                    </Button>
                </div>
            }
        >
            <Form form={form} name="brand" onFinish={onFinish} {...layout}>
                <FormItem
                    label="品牌名称"
                    name="username"
                    rules={[{required: true, message: '请输入品牌名称!'}]}
                >
                    <Input placeholder="品牌名称"/>
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App)
import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input} from 'antd';

const FormItem = Form.Item

interface Iprops {

}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState({})
    const [data, setData] = useState({})
    const [optType, setOptType] = useState('')

    const [cateId, setCateId] = useState(0)

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
        wrapperCol: {span: 17},
    }

    return (
        <Drawer
            title={optType === 'add' ? '添加分类' : '编辑分类'}
            placement="right"
            onClose={onClose}
            visible={visible}
            width={620}
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
            <Form form={form} name="addCate" onFinish={onFinish} {...layout}>
                <FormItem
                    label="分类名称"
                    name="username"
                    rules={[{required: true, message: '请输入分类名称!'}]}
                >
                    <Input placeholder="分类名称"/>
                </FormItem>
                <FormItem
                    name="username"
                    label="分类属性"
                    rules={[{required: true, message: '请输入分类属性!'}]}
                >
                    <Input placeholder="分类属性"/>
                </FormItem>

            </Form>
        </Drawer>
    )
}

export default forwardRef(App)
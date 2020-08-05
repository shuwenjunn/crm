import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Drawer, Button, Form, Input, Switch } from 'antd';
import { apiRouter } from 'common/api'

const FormItem = Form.Item

interface Iprops {
    title: string

    refreshData(): void
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [optType, setOptType] = useState('')

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)
        setFieldValue(record)
    }

    const setFieldValue = (obj: any) => {
        const arr = []
        for (let i in obj) {
            arr.push({
                name: i,
                value: obj[i]
            })
        }
        form.setFields(arr)
    }

    const onClose = () => {
        form.resetFields()
        props.refreshData()
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const apiName = optType === 'add' ? 'university.major.add' : 'university.major.update'
            values.is_hot = values.is_hot ? true : false
            await apiRouter.router('crm-pc', apiName).request({
                major_info: JSON.stringify(values),
                major_id: record.id
            })
            onClose()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={500}
            destroyOnClose={true}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={form.submit} type="primary" loading={loading}>
                        确认
                    </Button>
                </div>
            }
        >
            <Form form={form} onFinish={onFinish} {...layout}>
                <FormItem
                    label="专业名称"
                    name="name"
                    rules={[{ required: true, message: '请输入专业名称!' }]}
                >
                    <Input placeholder="专业名称" />
                </FormItem>
                <FormItem
                    label="专业描述"
                    name="content"
                    rules={[{ required: true, message: '请输入专业描述!' }]}
                >
                    <Input.TextArea placeholder="专业描述" />
                </FormItem>
                <FormItem
                    label="是否置顶"
                    name="is_hot"
                    valuePropName="checked"
                >
                    <Switch />
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
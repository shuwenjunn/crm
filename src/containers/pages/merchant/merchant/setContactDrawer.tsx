import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Drawer, Button, Form, Input, Select, Cascader } from 'antd';
import { apiRouter } from 'common/api'

const FormItem = Form.Item
const Option = Select.Option

interface Iprops {
    refreshData(): void
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [optType, setOptType] = useState('')
    const [form] = Form.useForm()

    const optTypeMap = {
        'contacts.add': '添加联系人',
        'contacts.update': '编辑联系人',
        'contacts.updateaccount': '编辑账号',
    }

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

        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = async (values: any) => {
        console.log('values--------->>>>', values)
        setLoading(true)
        try {
            const apiName = `agent.${optType}`
            console.log('record.id', record)
            await apiRouter.router('crm-pc', apiName).request({
                contacts_info: JSON.stringify(values),
                contacts_id: record.id,
                agent_id: record.id
            })
            props.refreshData()
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
            title={optTypeMap[optType]}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={661}
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
                {optType === 'contacts.updateaccount' ? (
                    <div>
                        <FormItem
                            label="账号"
                            name="account"
                            rules={[{ required: true, message: '请输入账号!' }]}
                        >
                            <Input placeholder="联系人" />
                        </FormItem>
                        <FormItem
                            label="密码"
                            name="password"
                        >
                            <Input placeholder="密码" />
                        </FormItem>
                        <FormItem
                            label="状态"
                            name="account_status"
                        >
                            <Select placeholder="请选择账号状态">
                                <Option value={'enable'}>启用</Option>
                                <Option value={'notactive'}>待激活</Option>
                                <Option value={'lock'}>锁定</Option>
                                <Option value={'disable'}>禁用</Option>
                            </Select>
                        </FormItem>
                    </div>
                ) : (
                        <div>
                            <FormItem
                                label="联系人"
                                name="contacts"
                                rules={[{ required: true, message: '请输入联系人名称!' }]}
                            >
                                <Input placeholder="联系人" />
                            </FormItem>
                            <FormItem
                                label="联系电话"
                                name="phone"
                                rules={[{ required: true, message: '请输入联系电话!' }]}
                            >
                                <Input placeholder="联系电话" />
                            </FormItem>

                            <FormItem
                                label="联系邮箱"
                                name="email"
                                rules={[{ required: true, message: '请输入联系邮箱!' }]}
                            >
                                <Input placeholder="请输入联系邮箱" />
                            </FormItem>
                            <FormItem
                                label="性别"
                                name="gender"
                                rules={[{ required: true, message: '请选择性别!' }]}
                            >
                                <Select placeholder="请选择联系人性别">
                                    <Option value={'man'}>男</Option>
                                    <Option value={'woman'}>女</Option>
                                </Select>
                            </FormItem>
                        </div>
                    )}
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
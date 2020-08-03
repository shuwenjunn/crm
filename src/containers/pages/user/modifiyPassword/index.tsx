import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Drawer, Button, Form, Input, Switch } from 'antd';
import { apiRouter } from 'common/api'
import { hex_md5 } from "common/utils/security/CryptoMd5"
import { TokenEnum, TokenConstant } from 'common/utils/persistence';
import {
    withRouter
} from "react-router-dom"

const FormItem = Form.Item

interface Iprops {
    history: any
}

// @ts-ignore
const App: React.FC<Iprops> = (props) => {

    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            values.is_hot = values.is_hot ? true : false
            await apiRouter.router('crm-pc', 'staff.account.password.modify').request({
                new_password: hex_md5(values.new_password),
                old_password: hex_md5(values.old_password),
                repeat_password: hex_md5(values.repeat_password),
            })

            TokenConstant.remove();
            props.history.push('/login')
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

    const tailLayout = {
        wrapperCol: { offset: 5, span: 19 },
    }

    return (
        <div style={{ width: 900 }}>
            <Form form={form} onFinish={onFinish} {...layout}>
                <FormItem
                    label="原密码"
                    name="old_password"
                    rules={[{ required: true, message: '请输入原密码!' }]}
                >
                    <Input placeholder="原密码" type='password' />
                </FormItem>
                <FormItem
                    label="新密码"
                    name="new_password"
                    rules={[{ required: true, message: '请输入新密码!' }]}
                >
                    <Input placeholder="新密码" type='password' />
                </FormItem>
                <FormItem
                    label="确认密码"
                    name="repeat_password"
                    dependencies={['new_password']}
                    rules={[
                        { required: true, message: '请重新输入新密码!' },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('密码不一致!');
                            },
                        }),
                    ]}
                >
                    <Input placeholder="确认密码" type='password' />
                </FormItem>

                <FormItem
                    {...tailLayout}
                >
                    <Button style={{ marginRight: 8 }} type="primary" loading={loading} htmlType="submit">
                        确认
                    </Button>
                    <Button onClick={() => form.resetFields()}>
                        重置
                    </Button>
                </FormItem>
            </Form>
        </div>
    )
}

export default withRouter(App)
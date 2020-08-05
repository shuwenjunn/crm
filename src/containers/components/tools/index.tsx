import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input } from "antd";
import { SettingOutlined } from '@ant-design/icons';
import './index.less'
import { useForm } from 'antd/lib/form/Form';

interface Iprops {

}

const Index: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)

    const [form] = Form.useForm()

    useImperativeHandle(ref, () => ({

    }))

    const showModal = () => {
        setVisible(true)
    }

    const handleCancel = () => setVisible(false)

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 19 },
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        let apiServers = []
        for (let key in values) {
            apiServers.push({
                flag: key,
                url: `http://${values[key]}/interface/`,
                description: values[key]
            })
        }
        localStorage.setItem('apiServers', JSON.stringify(apiServers))
        localStorage.setItem('apiServersMap', JSON.stringify(values))
        history.go(0)
    };

    useEffect(() => {
        const apiServersMap = JSON.parse(localStorage.getItem('apiServersMap'))||{}
        form.setFieldsValue(apiServersMap)
    }, [])

    return (
        <div className='ip-config-wrapper'>
            {process.env.NODE_ENV == 'development' && (
                <div
                    style={{
                        width: 48,
                        height: 48,
                        position: 'fixed',
                        right: 0,
                        top: 240,
                        background: '#1890ff',
                        fontSize: 22,
                        color: '#fff',
                        cursor: 'pointer',
                        borderRadius: '4px 0 0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={showModal}
                >
                    <SettingOutlined />
                </div>
            )}
            <Modal
                visible={visible}
                title={'IP设置'}
                onCancel={handleCancel}
                onOk={form.submit}
            >
                <Form
                    {...layout}
                    name="ip-config-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="crm-pc"
                        name="crm-pc"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input addonBefore="http://"/>
                    </Form.Item>
                    <Form.Item
                        label="test"
                        name="test"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input addonBefore="http://"/>
                    </Form.Item>
                    <Form.Item
                        label="file"
                        name="file"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input addonBefore="http://"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default forwardRef(Index as any)
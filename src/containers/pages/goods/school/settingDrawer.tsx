import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Drawer, Button, Form, Input, Switch } from 'antd';
import { apiRouter } from 'common/api'
import CustomUpload from 'containers/components/upload'
import { serverConfig } from 'schema/server'
import useSearchAll from 'containers/components/useSearchAll'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')
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
        optType === 'edit' && form.setFieldsValue({ 'logo_url': [{ url: record.logo_url }] })
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
            const apiName = optType === 'add' ? 'university.school.add' : 'university.school.update'
            values.is_hot = values.is_hot ? true : false
            values.logo_url = values.logo_url[0].url.replace(imgUrlPrefix, '')
            await apiRouter.router('crm-pc', apiName).request({
                school_info: JSON.stringify(values),
                school_id: record.id
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
                    label="学校名称"
                    name="name"
                    rules={[{ required: true, message: '请输入学校名称!' }]}
                >
                    <Input placeholder="学校名称" />
                </FormItem>
                <FormItem
                    name="logo_url"
                    label="学校logo"
                    valuePropName="fileList"
                    extra="最多上传一张png、jpg格式图片"
                    rules={[{ required: true, message: '请上传学校logo!' }]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={1}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'logo_url': value })
                        }}
                    />
                </FormItem>
                <FormItem
                    label="学校描述"
                    name="content"
                    rules={[{ required: true, message: '请输入学校描述!' }]}
                >
                    <Input.TextArea placeholder="学校描述" />
                </FormItem>
                <FormItem
                    label="学校所在省"
                    name="province"
                    rules={[{ required: true, message: '请输入学校所在省!' }]}
                >
                    <Input placeholder="学校所在省" />
                </FormItem>
                <FormItem
                    label="学校所在市"
                    name="city"
                    rules={[{ required: true, message: '请输入学校所在市!' }]}
                >
                    <Input placeholder="学校所在市" />
                </FormItem>
                <FormItem
                    label="是否热门"
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
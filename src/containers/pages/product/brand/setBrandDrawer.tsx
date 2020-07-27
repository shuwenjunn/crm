import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input, Select} from 'antd';
import {apiRouter} from 'common/api'

const {Option} = Select
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
            const apiName = optType === 'add' ? 'production.brand.add' : 'production.brand.update'
            const params: any = {brand_info: JSON.stringify(values)}

            await apiRouter.router('crm-pc', apiName).request({
                brand_info: JSON.stringify(values),
                brand_id: record.id
            })
            onClose()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
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
            destroyOnClose={true}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{marginRight: 8}}>
                        取消
                    </Button>
                    <Button onClick={form.submit} type="primary" loading={loading}>
                        确认
                    </Button>
                </div>
            }
        >
            <Form form={form} name="brand" onFinish={onFinish} {...layout}>
                <FormItem
                    label="品牌名称"
                    name="name"
                    rules={[{required: true, message: '请输入品牌名称!'}]}
                >
                    <Input placeholder="品牌名称"/>
                </FormItem>
                <FormItem
                    name="industry"
                    label="行业"
                    rules={[{required: true, message: '请选择行业!'}]}
                >
                    <Select
                        placeholder="行业"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
                        allowClear
                    >
                        <Option value={'教育'}>教育</Option>
                        <Option value={'电商'}>电商</Option>
                    </Select>
                </FormItem>
                <FormItem
                    label="品牌描述"
                    name="description"
                    rules={[{required: true, message: '请填写品牌描述!'}]}
                >
                    <Input placeholder="品牌描述"/>
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
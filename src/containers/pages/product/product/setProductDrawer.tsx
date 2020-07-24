import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input} from 'antd';
import {apiRouter} from 'common/api'

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
        console.log(record)
        setOptType(optType)

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
            <Form form={form} name="brand" onFinish={onFinish} {...layout} initialValues={record}>
                <FormItem
                    label="品牌名称"
                    name="name"
                    rules={[{required: true, message: '请输入品牌名称!'}]}
                >
                    <Input placeholder="品牌名称"/>
                </FormItem>
                <FormItem
                    label="品牌描述"
                    name="description"
                >
                    <Input placeholder="品牌描述"/>
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Drawer, Button, Form, Input, Select, Cascader } from 'antd';
import { apiRouter } from 'common/api'
import CustomUpload from 'containers/components/upload'
import { serverConfig } from 'schema/server'
import useSearchAll from 'containers/components/useSearchAll'
import SubTitle from 'containers/components/subTitle'
import citys from 'assets/regionData/citys'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')
const FormItem = Form.Item
const Option = Select.Option

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
        optType === 'edit' && fetchData(record)
    }

    const fetchData = async (record: any) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'agent.get').request({
                agent_id: record.id
            })
            const newRecord = {
                ...record,
                ...result.agent_info
            }

            console.log('newRecord----->>>', newRecord)
           
            form.setFieldsValue({ 'license_picture': [newRecord.license_picture] })
            form.setFieldsValue({ 'official_seal': [newRecord.official_seal] })
            if (newRecord.area) {
                form.setFieldsValue({ 'regions': [newRecord.province, newRecord.city, newRecord.area] })
            } else {
                form.setFieldsValue({ 'regions': [newRecord.province, newRecord.city] })
            }
            setRecord(newRecord)
            delete newRecord['license_picture']
            delete newRecord['official_seal']
            setFieldValue(newRecord)
     
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
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
            const apiName = optType === 'add' ? 'agent.add' : 'agent.update'
            values.license_picture = values.license_picture[0]
            values.official_seal = values.official_seal[0]
            values.province = values.regions[0]
            values.city = values.regions[1]
            if (values.regions[2]) {
                values.area = values.regions[2]
            }

            await apiRouter.router('crm-pc', apiName).request({
                agent_info: JSON.stringify(values),
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
            title={props.title}
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
                <SubTitle
                    title='基础信息'
                    customStyle={{ padding: '8px 0' }}
                />
                <FormItem
                    label="代理商名称"
                    name="name"
                    rules={[{ required: true, message: '请输入代理商名称!' }]}
                >
                    <Input placeholder="代理商名称" />
                </FormItem>
                <FormItem
                    label="所在城市"
                    name="regions"
                    rules={[{ required: true, message: '请选择代理商所在市!' }]}
                >
                    <Cascader
                        options={citys}
                        placeholder="请选择代理商所在市"
                    />
                </FormItem>
                <FormItem
                    label="详细地址"
                    name="address"
                    rules={[{ required: true, message: '请输入详细地址!' }]}
                >
                    <Input.TextArea placeholder="详细地址" />
                </FormItem>
                <FormItem
                    label="信用代码"
                    name="license_code"
                    rules={[{ required: true, message: '请输入信用代码!' }]}
                >
                    <Input placeholder="信用代码" />
                </FormItem>
                <FormItem
                    name="official_seal"
                    label="上传公章"
                    valuePropName="fileList"
                    extra="请上传PNG格式透底图，用于客户签合同生成电子合同"
                    rules={[{ required: true, message: '请上传公章!' }]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={1}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'official_seal': value })
                        }}
                    />
                </FormItem>


                <FormItem
                    name="license_picture"
                    label="上传营业执照"
                    valuePropName="fileList"
                    extra="请上传PNG格式图"
                    rules={[{ required: true, message: '请上传营业执照!' }]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={1}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'license_picture': value })
                        }}
                    />
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Drawer, Button, Form, Input, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import './addCateDrawer.less'

const FormItem = Form.Item

interface Iprops {
    onAdd?: (obj: any) => void
    onEdit?: (obj: any) => void
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})
    const [optType, setOptType] = useState('')
    const [fields, setFields] = useState<number[]>([0])

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)
        console.log('record--------->>>', record)
        if (optType === 'edit') {
            form.setFieldsValue({ 'category': record.category })
            let arr = []
            for (let index = 0; index < record.attribute_list.length; index++) {
                console.log('index------>>', index)
                arr.push(index)
                form.setFieldsValue({
                    [`name__${index}`]: record.attribute_list[index].name
                })
            }
            setFields(arr)
        }
    }

    const onClose = () => {
        form.resetFields()
        setFields([0])
        setVisible(false)
    }

    // 判断是否有重复
    function hasDuplicates(a) {
        return _.uniq(a).length !== a.length;
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = (values: any) => {
        console.log(values)
        const obj: any = {
            category: values.category,
        }
        let arr = []
        for (let key in values) {
            if (key.includes('__')) {
                arr.push({
                    name: values[key]
                })
            }
        }
        arr = arr.sort()
        if (hasDuplicates(_.map(arr, 'name'))) {
            message.warning('属性值重复！')
            return
        }

        obj.attribute_list = arr

        if (optType === 'add') {
            obj.key = record.key
            props.onAdd(obj)
        } else {
            obj.key = record.key
            props.onEdit(obj)
        }


        onClose()
    }

    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    }

    const addField = () => {
        const newFieldId = fields[fields.length - 1] + 1
        setFields([...fields, newFieldId])
    }

    const removeField = (fieldId: number) => {
        const newFieldId = fields.filter(item => item !== fieldId)
        setFields(newFieldId)
    }

    const findDependencies = (fieldId: number): any[] => {
        let arr = []
        for (let i in fields) {
            if (fields[i] == fieldId) {
                arr.push(`name__${fields[i]}`)
            }
        }
        return arr
    }

    return (
        <Drawer
            title={optType === 'add' ? '添加分类' : '编辑分类'}
            placement="right"
            onClose={onClose}
            visible={visible}
            width={650}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={form.submit} type="primary">
                        确认
                    </Button>
                </div>
            }
        >
            <Form form={form} name="attribute_list" onFinish={onFinish} {...layout}>
                <FormItem
                    label="分类名称"
                    name="category"
                    rules={[{ required: true, message: '请输入分类名称!' }]}
                >
                    <Input placeholder="分类名称" style={{ width: '85%' }} maxLength={8}/>
                </FormItem>
                {fields.map((fieldId, index) => (
                    <FormItem
                        key={fieldId}
                        label={index === 0 ? '分类属性' : ' '}
                        colon={index === 0}
                        required={index === 0}
                    >
                        <FormItem
                            noStyle
                            name={`name__${fieldId}`}
                            // dependencies={findDependencies(fieldId)}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入分类属性!",
                                },
                                // ({getFieldValue}) => ({
                                //     validator(rule, value) {
                                //         findDependencies(fieldId).forEach(item => {
                                //             if (value === getFieldValue(item)) {
                                //                 return Promise.reject('属性名重复');
                                //             }
                                //         })
                                //         return Promise.resolve();
                                //     },
                                // })
                            ]}
                        >
                            <Input placeholder="分类属性" style={{ width: '85%' }} maxLength={8}/>
                        </FormItem>
                        {index === fields.length - 1 ? (
                            <span>
                                {fields.length > 1 && (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => removeField(fieldId)}
                                    />
                                )}
                                <PlusCircleOutlined className="dynamic-delete-button" onClick={addField} />
                            </span>
                        ) : (
                                <span>
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => removeField(fieldId)}
                                    />
                                </span>
                            )}
                    </FormItem>
                ))}
            </Form>
        </Drawer>
    )
}

export default forwardRef(App as any)
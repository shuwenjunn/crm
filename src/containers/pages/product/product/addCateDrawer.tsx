import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input} from 'antd';
import {PlusCircleOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import './addCateDrawer.less'

const FormItem = Form.Item

interface Iprops {
    onAdd(obj: any): void
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState({})
    const [optType, setOptType] = useState('')
    const [fields, setFields] = useState<number[]>([0])

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)

    }
    const onClose = () => {
        form.resetFields()
        setFields([0])
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = (values: any) => {
        console.log(values)
        const obj: any = {
            category: values.category,
            key: values.category,
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

        obj.attribute_list = arr
        console.log('obj----->>', obj)
        props.onAdd(obj)
        onClose()
    }

    const layout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
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
                    <Button onClick={onClose} style={{marginRight: 8}}>
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
                    rules={[{required: true, message: '请输入分类名称!'}]}
                >
                    <Input placeholder="分类名称" style={{width: '85%'}}/>
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
                            dependencies={findDependencies(fieldId)}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入分类属性!",
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        findDependencies(fieldId).forEach(item => {
                                            if (value === getFieldValue(item)) {
                                                return Promise.reject('属性名重复');
                                            }
                                        })
                                        return Promise.resolve();
                                    },
                                })
                            ]}
                        >
                            <Input placeholder="分类属性" style={{width: '85%'}}/>
                        </FormItem>
                        {index === fields.length - 1 ? (
                            <span>
                                {fields.length > 1 && (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => removeField(fieldId)}
                                    />
                                )}
                                <PlusCircleOutlined className="dynamic-delete-button" onClick={addField}/>
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
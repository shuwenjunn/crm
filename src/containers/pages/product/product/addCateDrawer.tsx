import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input} from 'antd';
import {PlusCircleOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import './addCateDrawer.less'

const FormItem = Form.Item

interface Iprops {

}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState({})
    const [data, setData] = useState({})
    const [optType, setOptType] = useState('')
    const [fields, setFields] = useState([0])

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)

    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = (values: any) => {
        console.log(values)
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
            <Form form={form} name="brand" onFinish={onFinish} {...layout}>
                <FormItem
                    label="分类名称"
                    name="username"
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
                            name={`cate__${fieldId}`}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入分类属性!",
                                },
                            ]}
                        >
                            <Input placeholder="分类属性" style={{width: '85%'}}/>
                        </FormItem>
                        {index === fields.length - 1 ? (
                            <span>
                                {fields.length>1&&(
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
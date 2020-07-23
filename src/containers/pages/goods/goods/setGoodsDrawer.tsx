import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {Drawer, Button, Form, Input, Select, Checkbox, Table} from 'antd';

const FormItem = Form.Item

interface Iprops {
    title: string
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(true)
    const [record, setRecord] = useState({})
    const [data, setData] = useState({})
    const [optType, setOptType] = useState('')
    const [columns, setColumns] = useState<any[]>([])

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

    }

    const layout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    }

    const cataData: any[] = [
        {key: 'class', text: '班级分类', children: ['普通班', 'vip班']},
        {key: 'service', text: '服务分类', children: ['一对一', '多对多', '多对一']},
    ]

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={900}
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
            <Form
                form={form}
                name="brand"
                onFinish={onFinish}
                {...layout}
                onValuesChange={e=>console.log(e)}
            >


                <Form.Item
                    label="报考产品"
                    name="product_id"
                    rules={[{required: true, message: '请选择产品!'}]}
                >
                    <Select placeholder="产品">
                        <Select.Option value="demo">我是产品</Select.Option>
                    </Select>
                </Form.Item>
                <FormItem
                    label="分类信息"
                >
                    {cataData.map(item => {
                        return (
                            <FormItem
                                name={item.key}
                                key={item.key}
                                label={<div style={{color: '#666'}}>{item.text}</div>}
                                style={{marginBottom: 0}}
                            >
                                <Checkbox.Group>
                                    {item.children.map(it => (
                                        <Checkbox key={it} value={it}>{it}</Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </FormItem>
                        )
                    })}
                </FormItem>
                <FormItem
                    label="统一价"
                    required={true}
                >
                    <FormItem
                        name="username"
                        rules={[{required: true, message: '请输入统一价!'}]}
                    >
                        <Input placeholder="统一价" type={'number'}/>
                    </FormItem>
                    <FormItem
                        noStyle
                    >
                        <Table
                            size='small'
                            pagination={false}
                            dataSource={[
                                {
                                    key: '1',
                                    name: '胡彦斌',
                                    age: (
                                        <FormItem
                                            name="price-1"
                                            noStyle
                                        >
                                            <Input placeholder="价格" type={'number'}/>
                                        </FormItem>
                                    ),
                                    address: (
                                        <FormItem
                                            name="number-1"
                                            noStyle
                                        >
                                            <Input placeholder="数量" type={'number'}/>
                                        </FormItem>
                                    ),
                                },
                            ]}
                            columns={[
                                {
                                    title: '分类1',
                                    dataIndex: 'name',
                                    key: 'name',
                                },
                                {
                                    title: '分类2',
                                    dataIndex: 'aa',
                                    key: 'aa',
                                },
                                {
                                    title: '分类3',
                                    dataIndex: 'bb',
                                    key: 'bb',
                                },
                                {
                                    title: '年龄',
                                    dataIndex: 'age',
                                    key: 'age',
                                },
                                {
                                    title: '住址',
                                    dataIndex: 'address',
                                    key: 'address',
                                },
                            ]}
                        />
                    </FormItem>
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App)
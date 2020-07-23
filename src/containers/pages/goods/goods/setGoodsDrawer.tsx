import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
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
    const [tableData, setTableData] = useState<any[]>([])
    const [categoryData, setCategory] = useState<any>({})

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
        console.log('value', values)
    }

    const layout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    }

    const cataData: any[] = [
        {key: 'class', text: '班级分类', children: ['普通班', 'vip班']},
        {key: 'service', text: '服务分类', children: ['一对一', '多对多', '多对一']},
        {key: 'school', text: '学校', children: ['北大', '清华', '蓝翔']},
        {key: 'major', text: '专业', children: ['计算机', '化工', '文学']},
    ]

    useEffect(() => {
        console.log('casdfaadsasdfasdf', categoryData)
        let newColumns = []
        const newData: any = []
        for (let i in cataData) {
            if (Object.keys(categoryData).includes(cataData[i].key)) {
                if (categoryData[cataData[i].key].length > 0) {
                    newColumns.push({
                        title: cataData[i].text,
                        dataIndex: cataData[i].key,
                    })
                    newData.push(categoryData[cataData[i].key])
                }
            }
        }

        setColumns(newColumns)
        const skuData = cartesianProductOf(newData)
        console.log('skuData----->>', skuData)
        const data = []
        for (let i in skuData) {
            const obj: any = {
                key: skuData[i].join('&')
            }
            for (let j in skuData[i]) {
                const skuIt = skuData[i][j]
                for (let k in cataData) {
                    if (cataData[k].children.includes(skuIt)) {
                        obj[cataData[k].key] = skuIt
                    }
                }
            }
            obj.price = (
                <Input placeholder="价格" type={'number'}/>
            )
            obj.count = (
                <Input placeholder="数量" type={'number'}/>
            )
            data.push(obj)
        }
        console.log('data', data)
        setTableData(data)
    }, [categoryData])


    const cartesianProductOf = (arr: any) => {
        return arr.reduce(function (a, b) {
            var ret: any = [];
            a.forEach(function (a) {
                b.forEach(function (b) {
                    ret.push(a.concat([b]));
                });
            });
            return ret;
        }, [[]]);
    }


    const onValuesChange = (e: any) => {
        const data = {
            ...categoryData,
            ...e
        }
        for (let key in data) {
            if (data[key].length === 0) {
                delete data[key]
            }
        }
        setCategory(data)
    }

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
                onValuesChange={onValuesChange}
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
                    {columns.length > 0 && (
                        <FormItem
                            noStyle
                        >
                            <Table
                                size='small'
                                pagination={false}
                                dataSource={tableData}
                                columns={[...columns, {
                                    dataIndex: 'price', title: '价格',
                                    render: (text, record) => (
                                        <FormItem
                                            name={`${record.key}__price`}
                                            style={{marginBottom:0}}
                                        >
                                            {text}
                                        </FormItem>
                                    )
                                }, {
                                    dataIndex: 'count',
                                    title: '数量',
                                    render: (text, record) => (
                                        <FormItem
                                            name={`${record.key}__count`}
                                            style={{marginBottom:0}}
                                        >
                                            {text}
                                        </FormItem>
                                    )
                                }]}
                            />
                        </FormItem>
                    )}
                </FormItem>
            </Form>
        </Drawer>
    )
}

export default forwardRef(App)
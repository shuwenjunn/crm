import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Drawer, Button, Form, Input, Select, Checkbox, Table, Switch, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import {apiRouter} from 'common/api'
import './setGoodsDrawer.less'
import CustomUpload from './Upload'

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
    const [fileList, setFileList] = useState<any[]>([])


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
            data.push(obj)
        }
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


        console.log('eeeeeeeeeeeeeee-------->>>',e)
    }

    const customRequest = async (e: any) => {

        const file = e.file
        let fileName = file.name

        const fileData = {
            fileObj: file,
            fileName,
        }

        const extraParams = {
            store_type: 'goods',
            role: 'goods',
            upload_file: fileName
        }

        const result = await apiRouter.router('file', 'file.upload').upload(fileData, extraParams)

        console.log('result', result)
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
                    style={{marginBottom: 0}}
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
                                            style={{marginBottom: 0}}
                                        >
                                            <Input placeholder="价格" type={'number'}/>
                                        </FormItem>
                                    )
                                }, {
                                    dataIndex: 'count',
                                    title: '数量',
                                    render: (text, record) => (
                                        <FormItem
                                            name={`${record.key}__count`}
                                            style={{marginBottom: 0}}
                                        >
                                            <Input placeholder="数量" type={'number'}/>
                                        </FormItem>
                                    )
                                }]}
                            />
                        </FormItem>
                    )}
                </FormItem>

                <FormItem
                    name="status"
                    label={'上下架'}
                    rules={[{required: true, message: '请选择上下架状态!'}]}
                >
                    <Switch/>
                </FormItem>

                <Form.Item
                    name="upload"
                    label="商品轮播"
                    valuePropName="fileList"
                    extra="最多可上传5张"
                    rules={[{required: true, message: '请上传商品轮播图!'}]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={5}
                        onChange={(value: any) => {
                            form.setFieldsValue({'upload': value})
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="video"
                    label="商品视频"
                    valuePropName="fileList"
                    extra="商品视频"
                >
                    <CustomUpload
                        fileType='video'
                        limit={1}
                        onChange={(value: any) => {
                            form.setFieldsValue({'video': value})
                        }}
                    />
                </Form.Item>
            </Form>


        </Drawer>
    )
}

export default forwardRef(App as any)
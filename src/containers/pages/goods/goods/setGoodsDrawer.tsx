import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Drawer, Button, Form, Input, Select, Checkbox, Table, Switch } from 'antd';
import { apiRouter } from 'common/api'
import './setGoodsDrawer.less'
import CustomUpload from 'containers/components/upload'
import useSearchAll from 'containers/components/useSearchAll'

const FormItem = Form.Item

interface Iprops {
    title: string
    allSchool: any[]
    allMajor: any[]
    refreshData(): void
}

// @ts-ignore
const App: React.FC<Iprops> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})
    const [data, setData] = useState({})
    const [optType, setOptType] = useState('')
    const [columns, setColumns] = useState<any[]>([])
    const [tableData, setTableData] = useState<any[]>([])
    const [categoryData, setCategory] = useState<any>({})
    const allProduct = useSearchAll('production.searchall')
    const [currProductCate, setCurrProductCate] = useState([]) // 当前选择的产品所对应的所有的分类
    const [cataData, setCataData] = useState<any[]>([]) // 可供勾选的分类 原数据
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)

    }
    const onClose = () => {
        setVisible(false)
        setColumns([])
        setTableData([])
        setCategory([])
        setCategory({})
        setCurrProductCate([])
        setCataData([])
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const onFinish = async (values: any) => {
        console.log('value', values)
        console.log('table_data------->>>', tableData)


        const specification_list = []
        for (let i in tableData) {
            if (tableData[i].isRemove) {
                continue
            }
            const obj: any = {
                show_image: values[`${tableData[i].key}__imgurl`][0].url,
                sale_price: values[`${tableData[i].key}__price`] * 100,
                stock: values[`${tableData[i].key}__count`] * 1,
            }
            const specification_value_list = []
            for (let key in tableData[i]) {
                if (key === 'isRemove' || key === 'key') {
                    continue
                }
                specification_value_list.push({
                    category: key,
                    attribute: tableData[i][key]
                })
            }
            obj.specification_value_list = specification_value_list
            specification_list.push(obj)
        }
        console.log('specification_list----------->>>', specification_list)

        const goods_info = {
            title: values.title,//char # 标题
            video_display: values.video_display[0].url,//char # 宣传视频
            slideshow: values.slideshow.map((item: any) => item.url),//list # 轮播图
            detail: values.detail.map((item: any) => item.url),//list # 详情页
            market_price: values.market_price * 100,//int # 市场价, 单位:分
            despatch_type: values.despatch_type,//char # 发货方式 例：logistics -> 物流交付 、 phone_top_up -> 手机充值 、 eduction_contract -> 教育合同
            production_id: values.production_id,//int # 产品ID
            school_id: values.school_id,//int # 学校ID
            major_id: values.major_id,//int # 专业ID
            description: values.description,//char # 商品描述
            duration: values.duration,//char # 时长 例：one_year -> 1年 、 one_half_year -> 1.5年 、 two_year -> 2年 、 two_half_year -> 2.5年 、 other -> 其它
            remark: values.remark,//char # 备注
            specification_list: specification_list,//list # 规格列表
        }

        console.log('goods_info------->>>', goods_info)

        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'production.goods.add').request({
                goods_info: JSON.stringify(goods_info),
                goods_id: record.id
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
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
    }

    useEffect(() => {
        let newColumns = []
        const newData: any = []
        for (let i in cataData) {
            if (Object.keys(categoryData).includes(cataData[i].key)) {
                if (categoryData[cataData[i].key].length > 0) {
                    newColumns.push({
                        title: cataData[i].text,
                        dataIndex: cataData[i].key,
                        render: (text: string, record: any) => {
                            return (
                                <span style={{ textDecoration: record.isRemove ? 'line-through' : 'none' }}>
                                    {text}
                                </span>
                            )
                        }
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
                key: skuData[i].join('&'),
                isRemove: false
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

    }

    const onCateChange = (record: any, isRemove: boolean) => {
        const data: any = [...tableData]
        const index = data.findIndex((item: any) => item.key === record.key)
        data[index].isRemove = isRemove
        setTableData(data)
    }

    const onSelectProduct = (id: number) => {
        const allCate = allProduct.filter(item => item.id === id)[0].attribute_list

        // 数据重置
        form.resetFields(['production_selected_cate'])
        setCataData([])
        setCategory({})

        setCurrProductCate(allCate)
    }

    const onSelectCate = (value: string[]) => {
        const cataData = []
        for (let i in value) {
            for (let j in currProductCate) {
                if (currProductCate[j].category === value[i]) {
                    cataData.push({
                        key: value[i],
                        text: `${value[i]}分类`,
                        children: currProductCate[j].attribute_list.map((item: { name: string }) => item.name)
                    })
                }
            }
        }
        setCataData(cataData)
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={1000}
            destroyOnClose
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
            <Form
                form={form}
                name="brand"
                onFinish={onFinish}
                {...layout}
                onValuesChange={onValuesChange}
            >


                <Form.Item
                    label="报考产品"
                    required={true}
                    style={{ marginBottom: 0 }}
                >
                    <Form.Item
                        name="production_id"
                        rules={[{ required: true, message: '请选择产品!' }]}
                    >
                        <Select placeholder="选择产品" onChange={onSelectProduct}>
                            {allProduct.map(d => (
                                <Select.Option value={d.id} key={d.id}>{d.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {form.getFieldValue('production_id') && (
                        <Form.Item
                            name="production_selected_cate"
                            rules={[{ required: true, message: '请选择分类!' }]}
                        >
                            <Select placeholder="请选择分类" mode='multiple' onChange={onSelectCate}>
                                {currProductCate.map(d => (
                                    <Select.Option value={d.category} key={d.category}>{d.category}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {cataData.length > 0 && (
                        <FormItem>
                            {cataData.map(item => {
                                return (
                                    <FormItem
                                        name={item.key}
                                        key={item.key}
                                        label={<div style={{ color: '#666' }}>{item.text}</div>}
                                        style={{ marginBottom: 0 }}
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
                    )}
                </Form.Item>


                <FormItem
                    label="统一价"
                    required={true}
                    style={{ marginBottom: 0 }}
                >
                    <FormItem
                        name="market_price"
                        rules={[{ required: true, message: '请输入统一价!' }]}
                    >
                        <Input placeholder="统一价" type={'number'} />
                    </FormItem>
                    {columns.length > 0 && (
                        <FormItem
                            noStyle
                        >
                            <Table
                                size='small'
                                pagination={false}
                                dataSource={tableData}
                                // rowClassName={record=>record.isRemove?'removed':'normal'}
                                columns={[{
                                    dataIndex: 'specifications_url',
                                    title: '缩略图',
                                    render: (text, record) => (
                                        <Form.Item
                                            name={`${record.key}__imgurl`}
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: !record.isRemove, message: '请上传缩略图!' }]}
                                        >
                                            <CustomUpload
                                                fileType='image'
                                                limit={1}
                                                disabled={record.isRemove}
                                                onChange={(value: any) => {
                                                    form.setFieldsValue({ [`${record.key}__imgurl`]: value })
                                                }}
                                            />
                                        </Form.Item>
                                    )
                                }, ...columns, {
                                    dataIndex: 'price', title: '价格',
                                    render: (text, record) => (
                                        <FormItem
                                            name={`${record.key}__price`}
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: !record.isRemove, message: '请填写价格!' }]}
                                        >
                                            <Input disabled={record.isRemove} placeholder="价格" type={'number'} />
                                        </FormItem>
                                    )
                                }, {
                                    dataIndex: 'count',
                                    title: '数量',
                                    render: (text, record) => (
                                        <FormItem
                                            name={`${record.key}__count`}
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: !record.isRemove, message: '请填写数量!' }]}
                                        >
                                            <Input disabled={record.isRemove} placeholder="数量" type={'number'} />
                                        </FormItem>
                                    )
                                }, {
                                    dataIndex: 'options',
                                    title: '操作',
                                    render: (text, record) => (
                                        <span>
                                            {record.isRemove ? (
                                                <a style={{ color: '#52c41a' }}
                                                    onClick={() => onCateChange(record, false)}>恢复</a>
                                            ) : (
                                                    <a
                                                        onClick={() => onCateChange(record, true)}
                                                    >
                                                        删除
                                                    </a>
                                                )}

                                        </span>
                                    )
                                }]}
                            />
                        </FormItem>
                    )}
                </FormItem>

                <FormItem
                    name="despatch_type"
                    label={'发货方式'}
                    rules={[{ required: true, message: '请选择发货方式!' }]}
                >
                    <Select placeholder="发货方式">
                        <Select.Option value='logistics'>物流</Select.Option>
                        <Select.Option value='phone_top_up'>手机充值</Select.Option>
                        <Select.Option value='eduction_contract'>教育合同</Select.Option>
                    </Select>
                </FormItem>

                <FormItem
                    name="school_id"
                    label={'学校'}
                    rules={[{ required: true, message: '请选择学校!' }]}
                >
                    <Select placeholder="请选择学校">
                        {props.allSchool.map(d => (
                            <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                        ))}
                    </Select>
                </FormItem>

                <FormItem
                    name="major_id"
                    label={'专业'}
                    rules={[{ required: true, message: '请选择专业!' }]}
                >
                    <Select placeholder="请选择专业">
                        {props.allMajor.map(d => (
                            <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                        ))}
                    </Select>
                </FormItem>

                <FormItem
                    name="duration"
                    label={'学年'}
                    rules={[{ required: true, message: '请选择学年!' }]}
                >
                    <Select placeholder="请选择学年">
                        <Select.Option value='one_year'>1年</Select.Option>
                        <Select.Option value='one_half_year'>1.5年</Select.Option>
                        <Select.Option value='two_year'>2年</Select.Option>
                        <Select.Option value='two_half_year'>2.5年</Select.Option>
                        <Select.Option value='other'>其他</Select.Option>
                    </Select>
                </FormItem>

                <FormItem
                    name="title"
                    label={'商品名称'}
                    rules={[{ required: true, message: '请填写商品名称!' }]}
                >
                    <Input placeholder='请填写商品名称' />
                </FormItem>

                <FormItem
                    name="description"
                    label={'商品描述'}
                    rules={[{ required: true, message: '请填写商品描述!' }]}
                >
                    <Input.TextArea placeholder='请填写商品描述' />
                </FormItem>

                <FormItem
                    name="remark"
                    label={'备注'}
                    rules={[{ required: true, message: '请填写商品备注!' }]}
                >
                    <Input.TextArea placeholder='请填写商品备注' />
                </FormItem>

                {optType === 'edit' && (
                    <FormItem
                        name="status"
                        label={'上下架'}
                        valuePropName="checked"
                        rules={[{ required: true, message: '请选择上下架状态!' }]}
                    >
                        <Switch checkedChildren="上架" unCheckedChildren="下架" />
                    </FormItem>
                )}

                <Form.Item
                    name="slideshow"
                    label="商品轮播图片"
                    valuePropName="fileList"
                    extra="最多可上传5张商品轮播图片"
                    rules={[{ required: true, message: '请上传商品轮播图!' }]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={5}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'slideshow': value })
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="video_display"
                    label="商品视频"
                    valuePropName="fileList"
                    extra="最多可上传1段商品视频"
                    rules={[{ required: true, message: '请上传1段商品视频!' }]}
                >
                    <CustomUpload
                        fileType='video'
                        limit={1}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'video_display': value })
                        }}

                    />
                </Form.Item>

                <Form.Item
                    name="detail"
                    label="图文详情"
                    valuePropName="fileList"
                    extra="最多可上传5张详情图片"
                    rules={[{ required: true, message: '请上传详情图!' }]}
                >
                    <CustomUpload
                        fileType='image'
                        limit={6}
                        onChange={(value: any) => {
                            form.setFieldsValue({ 'detail': value })
                        }}
                    />
                </Form.Item>
            </Form>


        </Drawer>
    )
}

export default forwardRef(App as any)
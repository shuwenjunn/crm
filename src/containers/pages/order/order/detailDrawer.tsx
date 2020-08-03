import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Drawer, Button, Form, Input, Switch } from 'antd';
import { apiRouter } from 'common/api'
import SubTitle from 'containers/components/subTitle'
import DescribeList from 'containers/components/describeList'
import { DescribeCard, IdescribeCardProps } from 'containers/components/describeCard'
import GoodsItem from './components/goodsItem'

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
    const [data, setData] = useState<any>({ snapshoot_list: [] })

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setRecord(record)
        setOptType(optType)
        fetchData(record)
    }

    const fetchData = async (record: any) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'order.get').request({
                order_id: record.id
            })
            setData(result.order_info)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const onClose = () => {
        form.resetFields()
        props.refreshData()
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const statusMap = {
        order_launched: { text: '已下单' },
        payment_finished: { text: '已支付' },
        delivery_finished: { text: '已发货' },
        order_closed: { text: '订单关闭' },
        order_finished: { text: '已完成' },
    }

    const durationMap = {
        one_year: '1年',
        one_half_year: '1.5年',
        two_year: '2年',
        two_half_year: '2.5年',
        other: '其它',
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={771}
            destroyOnClose={true}
        >
            <SubTitle
                title={'买家信息'}
            />

            <DescribeList
                width={50}
                data={[
                    {
                        label: '姓名',
                        value: data.name,
                    },
                    {
                        label: '手机号',
                        value: data.phone,
                    },
                    {
                        label: '身份证',
                        value: data.identification,
                    },
                    {
                        label: '注册时间',
                        value: data.register_time,
                    },
                ]}
            />
            <div style={{ borderBottom: '1px solid #EEEEEE', marginBottom: 8 }}></div>
            <SubTitle
                title={'收货信息'}
            />
            <DescribeList
                width={100}
                data={[
                    {
                        label: '收货信息',
                        value: `${data.re_name}，${data.re_phone}，${data.re_address}`,
                    },
                    {
                        label: '留言',
                        value: data.remark,
                    },
                ]}
            />
            <div style={{ borderBottom: '1px solid #EEEEEE', marginBottom: 8 }}></div>

            <SubTitle
                title={'订单信息'}
            />
            <DescribeCard
                bordered={true}
                data={
                    [
                        {
                            children: [
                                {
                                    label: '订单号',
                                    value: data.number,
                                },
                            ],
                            isHeader: true,
                        },
                        {
                            children: [
                                {
                                    label: '总金额',
                                    value: (data.strike_price / 100).toFixed(2),
                                },
                                {
                                    label: '实付款',
                                    value: (data.actual_amount / 100).toFixed(2),
                                },
                                {
                                    label: '总金额',
                                    value: (data.actual_amount / 100).toFixed(2),
                                },
                            ],
                        },
                        {
                            children: [
                                {
                                    label: '订单状态',
                                    value: data.status && statusMap[data.status].text,
                                },
                                {
                                    label: '来源',
                                    value: data.source,
                                },
                            ],
                        },
                        {
                            children: [
                                {
                                    label: '下单时间',
                                    value: data.create_time,
                                },
                            ],
                        },
                    ]
                }
            />
            {data.snapshoot_list.map(item => (
                <GoodsItem
                    key={item.id}
                    thumbnail={item.show_image}
                    goodsDescData={
                        [
                            {
                                children: [
                                    {
                                        label: '商品',
                                        value: item.title,
                                    },
                                    {
                                        label: '学校',
                                        value: item.school_name,
                                    },
                                    {
                                        label: '属性',
                                        value: '暂无数据',
                                    },
                                ],
                                customStyle: {
                                    height: 20,
                                    marginBottom: 8
                                }
                            },
                            {
                                children: [
                                    {
                                        label: '品牌',
                                        value: item.brand_name
                                    },
                                    {
                                        label: '专业',
                                        value: item.major_name
                                    },
                                    {
                                        label: '价格',
                                        value: (item.sale_price / 100).toFixed(2)
                                    },
                                ],
                                customStyle: {
                                    height: 20,
                                    marginBottom: 8
                                }
                            },
                            {
                                children: [
                                    {
                                        label: '产品',
                                        value: item.production_name,
                                    },
                                    {
                                        label: '学制',
                                        value: durationMap[item.duration],
                                    },
                                    {
                                        label: '状态',
                                        value: '暂无数据',
                                    },
                                ],
                                customStyle: {
                                    height: 20,
                                    marginBottom: 8
                                }
                            },
                            {
                                children: [
                                    {
                                        label: '数量',
                                        value: 'x1',
                                    },
                                    {
                                        label: '发货',
                                        value: '暂无数据',
                                    },
                                    {
                                        label: '',
                                        value: '',
                                    },
                                ],
                                customStyle: {
                                    height: 20,
                                    marginBottom: 8
                                }
                            },
                        ]
                    }
                />
            ))}

        </Drawer>
    )
}

export default forwardRef(App as any)
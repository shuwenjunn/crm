import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Table, Popconfirm } from 'antd'
import { apiRouter } from 'common/api'
import DetailDrawer from './detailDrawer';
import ImgPreview from 'containers/components/imgPreview';
import GoodsItem from './components/goodsItem'
import { serverConfig } from 'schema/server'
import './index.less'
import { ClockCircleOutlined, OrderedListOutlined, AppstoreAddOutlined } from '@ant-design/icons'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')

const FormItem = Form.Item

const Page = () => {
    const drawerRef = useRef()
    const [form] = Form.useForm()

    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({ showQuickJumper: true, current: 1 })
    const [data, setData] = useState<any[]>([])
    const [drawerTitle, setDrawerTitle] = useState('')
    const [loading, setLoading] = useState(false)


    const onFinish = (values: any) => {
        setPagination({ showQuickJumper: true, current: 1 })
        setSearchInfo({
            ...values,
        })
    }

    useEffect(() => {
        fetchTableData()
    }, [searchInfo])

    const fetchTableData = async (current = 1) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'order.search').request({
                search_info: JSON.stringify(searchInfo),
                current_page: current
            })
            setPagination({ ...pagination, total: result.total, current: current })
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const removeTableItem = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'order.remove').request({
                major_id: id
            })
            refreshData()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const setTop = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'order.settop').request({
                major_id: id
            })
            refreshData()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshData = () => {
        fetchTableData(pagination.current)
    }

    const statusMap = {
        order_launched: { text: '已下单' },
        payment_finished: { text: '已支付' },
        delivery_finished: { text: '已发货' },
        order_closed: { text: '订单关闭' },
        order_finished: { text: '已完成' },
    }

    return (
        <div>
            <DetailDrawer
                title={'订单详情'}
                refreshData={refreshData}
                ref={drawerRef}
            />

            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="name"
                >
                    <Input placeholder="请填写订单号" />
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        搜索
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields()
                        }}
                    >
                        重置
                    </Button>
                    {/* <Button
                        style={{ margin: '0 8px' }}
                        type="primary"
                        onClick={() => {
                            setDrawerTitle('添加专业');
                            (drawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加专业
                    </Button> */}
                </FormItem>
            </Form>
            <Table
                columns={[
                    {
                        title: '订单信息',
                        dataIndex: 'order_info',
                        render: (text, record) => {
                            return (
                                <div>
                                    <div><OrderedListOutlined style={{ fontWeight: 'bold' }} /> {record.number}</div>
                                    <div><ClockCircleOutlined style={{ fontWeight: 'bold' }} /> {record.create_time}</div>
                                    <div><AppstoreAddOutlined style={{ fontWeight: 'bold' }} /> {record.source}</div>
                                    <div><ClockCircleOutlined style={{ fontWeight: 'bold' }} /> {record.last_payment_time}</div>
                                </div>
                            )
                        }
                    },
                    {
                        title: '商品信息',
                        dataIndex: 'order_info',
                        render: (text, record) => {
                            return record.snapshoot_list.map(item => {
                                return (
                                    <div key={item.id}>
                                        <div className='item'>
                                            <div className="label">商品：</div>
                                            <div className="value">{item.title}</div>
                                        </div>
                                        <div className='item'>
                                            <div className="label">品牌：</div>
                                            <div className="value">{item.brand_name}</div>
                                        </div>
                                        <div className='item'>
                                            <div className="label">产品：</div>
                                            <div className="value">{item.production_name}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount',
                        render: (text, record) => {
                            return (
                                <div>
                                    <div className='item'>
                                        <div className="label">总额：</div>
                                        <div className="value">{(record.strike_price / 100).toFixed(2)}</div>
                                    </div>
                                    <div className='item'>
                                        <div className="label">实付：</div>
                                        <div className="value">{(record.actual_amount / 100).toFixed(2)}</div>
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        render: (text, record) => {
                            return (
                                <div>
                                    <div className='item'>
                                        <div className="label">订单状态：</div>
                                        <div className="value">{statusMap[record.status].text}</div>
                                    </div>
                                    <div className='item'>
                                        <div className="label">订单售后：</div>
                                        <div className="value">暂无</div>
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        title: '买家信息',
                        dataIndex: 'buyer_info',
                        render: (text, record) => {
                            return (
                                <div>
                                    <div className='item'>
                                        <div className="label">手机：</div>
                                        <div className="value">{record.re_phone}</div>
                                    </div>
                                    <div className='item'>
                                        <div className="label">姓名：</div>
                                        <div className="value">{record.re_name}</div>
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        title: '订单归属',
                        dataIndex: 'order_owner',
                    },
                    {
                        title: '操作',
                        dataIndex: 'opt',
                        render: (_, record: any) => {
                            return (
                                <span>
                                    <a
                                        onClick={() => {
                                            setDrawerTitle('编辑专业');
                                            (drawerRef.current as any).showDrawer(record, 'edit')
                                        }}
                                    >
                                        详情
                                    </a>
                                </span>
                            )
                        }
                    },
                ]}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{ marginTop: 16 }}
                onChange={(page) => fetchTableData(page.current)}
                pagination={pagination}
                rowKey={(record: any) => record.id}
            />
        </div>
    )
}

export default Page

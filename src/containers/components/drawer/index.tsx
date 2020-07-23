import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {Drawer, Button, Table} from 'antd'
import {apiRouter} from 'common/api'

interface DrawerProps {
    showFooter: boolean
    title: string
    width: number

    renderContent(data: any): React.ReactNode

    request(record: any): any
}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})
    const [data, setData] = useState({})
    const [balanceData, setBalanceData] = useState([])
    const [loading, setLoading] = useState({})
    const [pagination, setPagination] = useState<any>({showQuickJumper: true, current: 1})

    const showDrawer = (record: any) => {
        setVisible(true)
        setRecord(record)
        fetchData(record)
        fetchTableData(record)
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))


    const fetchData = async (params: any) => {
        const result = await props.request(params)
        setData(result.customer_info)
    }

    const fetchTableData = async (record: any, current = 1) => {
        setLoading(true)
        try {
            const params = {
                customer_id: record.id,
                current_page: current
            }
            console.log('params----->>', params)
            const result = await apiRouter.router('crm-pc', 'customer.transaction.search').request(params)
            console.log('result--------->>>', result)
            setPagination({...pagination, total: result.total, current: current})
            setBalanceData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer
            title={props.title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={props.width}
            footer={
                props.showFooter && (
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{marginRight: 8}}>
                            Cancel
                        </Button>
                        <Button onClick={onClose} type="primary">
                            Submit
                        </Button>
                    </div>
                )
            }
        >
            {props.renderContent(data)}
            <Table
                scroll={{x: props.width + 300}}
                columns={[
                    {
                        title: '交易编号',
                        dataIndex: 'number',
                        fixed: 'left',
                        width: 150,
                    },
                    {
                        title: '出入账',
                        dataIndex: 'symbol',
                        width: 80,
                        render: (text, record) => record.amount > 0 ? '入账' : '出账'
                    },
                    {
                        title: '金额/元',
                        dataIndex: 'amount',
                        width: 150,
                        render: (text, record) => (text / 100).toFixed(2)
                    },
                    {
                        title: '交易类型',
                        dataIndex: 'type',
                        width: 80,
                        render: (text, record) => record.amount > 0 ? '充值' : '提现'
                    },
                    {
                        title: '交易方式',
                        dataIndex: 'pay_type',
                        width: 80,
                        render: (text: string, record) => {
                            const map = {
                                bank: '银行',
                                alipay: '支付宝',
                                wechat: '微信',
                                balance: '余额',
                            }
                            return map[text]
                        }
                    },
                    {
                        title: '业务来源',
                        dataIndex: 'business_type',
                        width: 80,
                        render: (text: string, record) => {
                            const map = {
                                order: '订单',
                                balance: '余额',
                            }
                            return map[text]
                        }
                    },
                    {
                        title: '时间',
                        width: 200,
                        dataIndex: 'create_time',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                    }
                ]}
                dataSource={balanceData || []}
                size={'small'}
                loading={loading}
                style={{marginTop: 16}}
                onChange={(page) => fetchTableData(record, page.current)}
                pagination={pagination}
                rowKey={(record) => record.id}
            />
        </Drawer>
    )
}

export default forwardRef(App)
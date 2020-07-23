import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Button, Table, Badge, DatePicker} from 'antd'
import {apiRouter} from 'common/api'
import DrawerWrapper from 'containers/components/drawer';
import SubTitle from 'containers/components/subTitle';
import DescribeList from 'containers/components/describeList';
import ImgPreview from 'containers/components/imgPreview';
import RealNameDrawer from './components/realDrawer'
import AddressDrawer from './components/addressDrawer'
import BankCardDrawer from './components/bankcardDrawer'


const FormItem = Form.Item
const {RangePicker} = DatePicker;

const Page = () => {
    const drawerRef = useRef()
    const realnameRef = useRef()
    const addressRef = useRef()
    const bankcardRef = useRef()
    const [form] = Form.useForm()

    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({showQuickJumper: true, current: 1})
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const statusMap = {
        enable: {text: '启用', color: '#4CCA79'},
        lock: {text: '锁定', color: '#FF7070'},
        disabled: {text: '禁用', color: '#FF7070'},
        notactive: {text: '待激活', color: '#108EE9'},
    }

    const genderMap = {
        man: '男',
        woman: '女',
        unknown: '未知'
    }

    const onFinish = (values: any) => {
        setPagination({showQuickJumper: true, current: 1})
        const params = {
            ...values,
            ...handleRangePicker(values.create_time, 'YYYY-MM-DD HH:mm:ss', 'create_time__gte', 'create_time__lte')
        }
        for (let key in params) {
            if (typeof params === 'string') {
                delete params[key]
            }
        }
        // if (params.create_time) {
        //     delete params.create_time
        // }
        setSearchInfo(params)
    }

    const handleRangePicker = (value: any, format: any, startKey: string, endKey: string): any => {
        if (value && value.length > 0) {
            return {
                [startKey]: value[0].format('YYYY-MM-DD 00:00:00'),
                [endKey]: value[1].format('YYYY-MM-DD 23:59:59'),
            }
        } else {
            return {}
        }
    }

    useEffect(() => {
        fetchTableData()
    }, [searchInfo])
    const fetchTableData = async (current = 1) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'customer.search').request({
                search_info: JSON.stringify(searchInfo),
                current_page: current
            })
            setPagination({...pagination, total: result.total, current: current})
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }
    const columns = [
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '昵称',
            dataIndex: 'nick',
        },
        {
            title: '头像',
            dataIndex: 'head_url',
            render: (text) => {
                return (
                    <ImgPreview
                        url={text}
                        title={'头像'}
                        customerStyle={{
                            width: 88,
                            height: 88,
                            cursor: "pointer"
                        }}
                    />
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            render: (text: string) => genderMap[text]
        },
        {
            title: '生日',
            dataIndex: 'birthday',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '微信',
            dataIndex: 'wechat',
        },
        {
            title: 'qq',
            dataIndex: 'qq',
        },
        {
            title: '账号',
            dataIndex: 'username',
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            render: (text: string) => {
                // @ts-ignore
                return <Badge color={statusMap[text].color} text={statusMap[text].text}/>
            }
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'opt',
            render: (_, record: unknown) => {
                return (
                    <span>
                        <a onClick={() => (drawerRef.current as any).showDrawer(record)}>详情</a>
                    </span>
                )
            }
        },
    ]


    return (
        <div>
            <DrawerWrapper
                ref={drawerRef}
                showFooter={false}
                title='客户详情'
                width={771}
                request={(record: any) => apiRouter.router('crm-pc', 'customer.get').request({
                    customer_id: record.id
                })}
                renderContent={(data: any) => {

                    // @ts-ignore
                    return (
                        <React.Fragment>
                            <SubTitle title='用户信息'/>
                            <DescribeList
                                width={50}
                                data={[
                                    {
                                        label: '昵称',
                                        value: data.nick,
                                    },
                                    {
                                        label: '手机号',
                                        value: data.phone,
                                    },
                                    {
                                        label: '性别',
                                        value: genderMap[data.gender],
                                    },
                                    {
                                        label: '注册时间',
                                        value: data.create_time,
                                    },
                                    {
                                        label: '账号',
                                        value: data.username,
                                    },
                                    {
                                        label: '账号状态',
                                        value: data.status && (<Badge color={statusMap[data.status].color}
                                                                      text={statusMap[data.status].text}/>),
                                    },
                                    {
                                        label: '是否实名',
                                        value: <span>{data.is_realname ? '已实名' : '未实名'} {data.is_realname ?
                                            <a onClick={() => realnameRef.current.showDrawer(data.customer_info)}>查看实名信息
                                                ></a> : null}</span>,
                                    },
                                    {
                                        label: '地址信息',
                                        value: (
                                            <a onClick={() => addressRef.current.showDrawer(data)}>全部地址信息 ></a>
                                        ),
                                    },
                                    {
                                        label: '银行卡',
                                        value: <a onClick={() => bankcardRef.current.showDrawer(data)}>查看银行卡信息 ></a>,
                                    },
                                    {
                                        label: '邮箱',
                                        value: data.email,
                                    },
                                    {
                                        label: '微信',
                                        value: data.wechat,
                                    },
                                    {
                                        label: 'qq',
                                        value: data.qq,
                                    },
                                ]}
                            />
                            <RealNameDrawer
                                ref={realnameRef}
                            />
                            <SubTitle
                                title='用户信息'
                                rightCon={<span>账户余额：￥{(data.balance / 100).toFixed(2)}</span>}
                            />

                            <AddressDrawer
                                ref={addressRef}
                            />
                            <BankCardDrawer
                                ref={bankcardRef}
                            />
                        </React.Fragment>
                    )
                }}
            />

            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="nick"
                >
                    <Input placeholder="客户昵称"/>
                </FormItem>
                <FormItem
                    name="create_time"
                >
                    <RangePicker placeholder={['注册时间', '注册时间']}/>
                </FormItem>

                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        搜索
                    </Button>
                    <Button
                        style={{margin: '0 8px'}}
                        onClick={() => {
                            form.resetFields()
                        }}
                    >
                        重置
                    </Button>
                </FormItem>
            </Form>
            <Table
                columns={columns}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{marginTop: 16}}
                onChange={(page) => fetchTableData(page.current)}
                pagination={pagination}
                rowKey={(record) => record.id}
            />
        </div>
    )
}

export default Page
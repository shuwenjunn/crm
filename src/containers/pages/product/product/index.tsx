import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Button, Table, Badge, Popconfirm} from 'antd'
import {apiRouter} from 'common/api'
import SetProductDrawer from './setProductDrawer';
import DetailDrawer from '../product/detailDrawer'
import detailDrawer from "../product/detailDrawer";

const FormItem = Form.Item

const Page = () => {
    const drawerRef = useRef()
    const detailDrawerRef = useRef()
    const [form] = Form.useForm()

    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({showQuickJumper: false, current: 1})
    const [data, setData] = useState<any[]>([])
    const [drawerTitle, setDrawerTitle] = useState('')
    const [loading, setLoading] = useState(false)


    const onFinish = (values: any) => {
        setPagination({showQuickJumper: false, current: 1})
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
            const result = await apiRouter.router('crm-pc', 'production.search').request({
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

    const refreshData = () => {
        fetchTableData(pagination.current)
    }

    const removeTableItem = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'production.remove').request({
                production_id: id
            })
            refreshData()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <SetProductDrawer
                ref={drawerRef}
                title={drawerTitle}
                refreshData={refreshData}
            />

            <DetailDrawer
                ref={detailDrawerRef}
                refreshData={refreshData}
            />
            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="name"
                >
                    <Input placeholder="产品名称"/>
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
                    <Button
                        style={{margin: '0 8px'}}
                        type="primary"
                        onClick={() => {
                            setDrawerTitle('添加产品');
                            (detailDrawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加产品
                    </Button>
                </FormItem>
            </Form>
            <Table
                columns={[
                    {
                        title: '产品名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '产品描述',
                        dataIndex: 'description',
                    },
                    {
                        title: '品牌名称',
                        dataIndex: 'brand_name',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'create_time',
                    },
                    {
                        title: '操作',
                        dataIndex: 'opt',
                        render: (_, record: unknown) => {
                            return (
                                <span>
                                    <a
                                        onClick={() => {
                                            setDrawerTitle('编辑产品');
                                            (detailDrawerRef.current as any).showDrawer(record, 'edit')
                                        }}
                                    >
                                        编辑
                                    </a>
                                    &nbsp;
                                    <Popconfirm
                                        title="你确定删除该产品吗?"
                                        onConfirm={() => removeTableItem(record.id)}
                                    >
                                        <a>删除</a>
                                    </Popconfirm>
                                </span>
                            )
                        }
                    },
                ]}
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

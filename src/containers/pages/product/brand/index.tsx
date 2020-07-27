import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Button, Table, Select, Popconfirm} from 'antd'
import {apiRouter} from 'common/api'
import SetBrandDrawer from './setBrandDrawer';
import DetailDrawer from '../product/detailDrawer'

const FormItem = Form.Item
const {Option} = Select

const Page = () => {
    const drawerRef = useRef()
    const [form] = Form.useForm()

    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({showQuickJumper: true, current: 1})
    const [data, setData] = useState<any[]>([])
    const [drawerTitle, setDrawerTitle] = useState('')
    const [loading, setLoading] = useState(false)


    const onFinish = (values: any) => {
        setPagination({showQuickJumper: true, current: 1})
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
            const result = await apiRouter.router('crm-pc', 'production.brand.search').request({
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

    const removeTableItem = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'production.brand.remove').request({
                brand_id: id
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

    return (
        <div>
            <SetBrandDrawer
                ref={drawerRef}
                title={drawerTitle}
                refreshData={refreshData}
            />

            <DetailDrawer

            />
            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="name"
                >
                    <Input placeholder="品牌"/>
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
                            setDrawerTitle('添加品牌');
                            (drawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加品牌
                    </Button>
                </FormItem>
            </Form>
            <Table
                columns={[
                    {
                        title: '品牌名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '行业',
                        dataIndex: 'industry',
                    },
                    {
                        title: '品牌描述',
                        dataIndex: 'description',
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
                                            setDrawerTitle('编辑品牌');
                                            (drawerRef.current as any).showDrawer(record, 'edit')
                                        }}
                                    >
                                        编辑
                                    </a>
                                    &nbsp;
                                    <Popconfirm
                                        title="你确定删除品牌吗?"
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

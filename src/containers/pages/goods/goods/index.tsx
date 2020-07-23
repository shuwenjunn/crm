import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Button, Table} from 'antd'
import {apiRouter} from 'common/api'
import SetGoodsDrawer from './setGoodsDrawer';

const FormItem = Form.Item

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
            title: '商品缩略图',
            dataIndex: 'phone',
        },
        {
            title: '商品名称',
            dataIndex: 'name',
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
                                (drawerRef.current as any).showDrawer({}, 'edit')
                            }}
                        >
                            编辑
                        </a>
                        &nbsp;
                        <a>删除</a>
                    </span>
                )
            }
        },
    ]

    return (
        <div>
            <SetGoodsDrawer
                ref={drawerRef}
                title={drawerTitle}
            />

            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="nick"
                >
                    <Input placeholder="品牌名称"/>
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
                            setDrawerTitle('添加商品');
                            (drawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加品牌
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

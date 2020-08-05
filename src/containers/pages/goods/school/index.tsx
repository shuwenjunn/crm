import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Table, Popconfirm } from 'antd'
import { apiRouter } from 'common/api'
import SettingDrawer from './settingDrawer';
import ImgPreview from 'containers/components/imgPreview';
import { serverConfig } from 'schema/server'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')

const FormItem = Form.Item

const Page = () => {
    const drawerRef = useRef()
    const [form] = Form.useForm()

    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({ showQuickJumper: false, current: 1 })
    const [data, setData] = useState<any[]>([])
    const [drawerTitle, setDrawerTitle] = useState('')
    const [loading, setLoading] = useState(false)


    const onFinish = (values: any) => {
        setPagination({ showQuickJumper: false, current: 1 })
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
            const result = await apiRouter.router('crm-pc', 'university.school.search').request({
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
            await apiRouter.router('crm-pc', 'university.school.remove').request({
                school_id: id
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
            await apiRouter.router('crm-pc', 'university.school.settop').request({
                school_id: id
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
            <SettingDrawer
                title={drawerTitle}
                refreshData={refreshData}
                ref={drawerRef}
            />

            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="name"
                >
                    <Input placeholder="学校名称" />
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
                    <Button
                        style={{ margin: '0 8px' }}
                        type="primary"
                        onClick={() => {
                            setDrawerTitle('添加学校');
                            (drawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加学校
                    </Button>
                </FormItem>
            </Form>
            <Table
                columns={[
                    {
                        title: '学校logo',
                        dataIndex: 'logo_url',
                        render: (text) => {
                            return (
                                <ImgPreview
                                    url={text.indexOf('http') > -1 ? text : `${imgUrlPrefix}${text}`}
                                    title={'学校logo'}
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
                        title: '学校名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '位置',
                        dataIndex: 'loaction',
                        render: (text, record) => {
                            return <span>{record.province}{record.city}</span>
                        }
                    },
                    {
                        title: '是否置顶',
                        dataIndex: 'is_hot',
                        render: (text, record) => text ? '是' : '否'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'create_time',
                    },
                    {
                        title: '操作',
                        dataIndex: 'opt',
                        render: (_, record: any) => {
                            return (
                                <span>
                                    <a
                                        onClick={() => {
                                            setDrawerTitle('编辑学校');
                                            (drawerRef.current as any).showDrawer(record, 'edit')
                                        }}
                                    >
                                        编辑
                                    </a>
                                    &nbsp;
                                    <Popconfirm
                                        title={`你确定${record.is_hot ? '取消置顶' : '置顶'}学校吗?`}
                                        onConfirm={() => setTop(record.id)}
                                    >

                                        <a>{record.is_hot ? '取消置顶' : '置顶'}</a>
                                    </Popconfirm>
                                    &nbsp;
                                    <Popconfirm
                                        title="你确定删除学校吗?"
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
                style={{ marginTop: 16 }}
                onChange={(page) => fetchTableData(page.current)}
                pagination={pagination}
                rowKey={(record: any) => record.id}
            />
        </div>
    )
}

export default Page

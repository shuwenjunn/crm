import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Table, Popconfirm } from 'antd'
import { apiRouter } from 'common/api'


const FormItem = Form.Item

const Page = () => {
    const [form] = Form.useForm()
    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({ showQuickJumper: true, current: 1 })
    const [data, setData] = useState<any[]>([])
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
            const result = await apiRouter.router('crm-pc', 'tool.sms.search').request({
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

    const refreshData = () => {
        fetchTableData(pagination.current)
    }

    const sceneMap = {
        register: '注册',
        forget: '找回密码',
        bindcard: '绑定银行卡',
        login: '登陆',
    }

    const sourceTypeMap = {
        crm: 'crm',
        customer: 'customer'
    }

    const statusMap = {
        success: '成功',
        fail: '失败',
        resend: '已重发'
    }

    return (
        <div>
    
            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="phone"
                >
                    <Input placeholder="手机号" />
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
                </FormItem>
            </Form>
            <Table
                columns={[
                    {
                        title: '手机号',
                        dataIndex: 'phone',
                    },
                    {
                        title: '短信内容',
                        dataIndex: 'content',
                    },
                    {
                        title: '场景',
                        dataIndex: 'scene',
                        render: (text: string, record) => sceneMap[text]
                    },
                    {
                        title: '平台',
                        dataIndex: 'source_type',
                        render: (text: string, record) => sourceTypeMap[text]
                    },
                    {
                        title: '发送状态',
                        dataIndex: 'status',
                        render: (text: string, record) => statusMap[text]
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'create_time',
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

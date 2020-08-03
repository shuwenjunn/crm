import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Table, Select, Popconfirm, Switch } from 'antd'
import { apiRouter } from 'common/api'
import SetGoodsDrawer from './setGoodsDrawer';
import ImgPreview from 'containers/components/imgPreview';
import useSearchAll from 'containers/components/useSearchAll'

import { serverConfig } from 'schema/server'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')

const Option = Select.Option
const FormItem = Form.Item

const Page = () => {
    const drawerRef = useRef()
    const [form] = Form.useForm()
    const [searchInfo, setSearchInfo] = useState({})
    const [pagination, setPagination] = useState<any>({ showQuickJumper: true, current: 1 })
    const [data, setData] = useState<any[]>([])
    const [drawerTitle, setDrawerTitle] = useState('')
    const [loading, setLoading] = useState(false)

    const allMajor = useSearchAll('university.major.searchall')
    const allSchool = useSearchAll('university.school.searchall')

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
            const result = await apiRouter.router('crm-pc', 'production.goods.search').request({
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

    const removeTableItem = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'production.goods.remove').request({
                goods_id: id
            })
            refreshData()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const onChangeStatus = async (id: number) => {
        setLoading(true)
        try {
            await apiRouter.router('crm-pc', 'production.goods.setuse').request({
                goods_id: id
            })
            refreshData()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }


    const columns = [
        {
            title: '商品主图',
            dataIndex: 'slideshow',
            render: (text: string[]) => {
                return (
                    <ImgPreview
                        url={`${text[0]}`}
                        title={'商品主图'}
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
            title: '商品名称',
            dataIndex: 'title',
        },
        {
            title: '商品缩略图',
            dataIndex: 'thumbnail',
            render: (text: string, record: any) => {
                return (
                    <ImgPreview
                        url={`${record.slideshow[0]}`}
                        title={'商品主图'}
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
            title: '学校',
            dataIndex: 'school_name',
        },
        {
            title: '专业',
            dataIndex: 'major_name',
        },
        {
            title: '学年',
            dataIndex: 'duration',
            render: (text, record) => {
                // <Select.Option value='one_year'>1年</Select.Option>
                // <Select.Option value='one_half_year'>1.5年</Select.Option>
                // <Select.Option value='two_year'>2年</Select.Option>
                // <Select.Option value='two_half_year'>2.5年</Select.Option>
                // <Select.Option value='other'>其他</Select.Option>
                const map = {
                    one_year: '1年',
                    one_half_year: '1.5年',
                    two_year: '2年',
                    two_half_year: '2.5年',
                    other: '其他',
                }

                return map[text]
            }
        },
        {
            title: '产品',
            dataIndex: 'production_name',
        },
        {
            title: '品牌',
            dataIndex: 'brand_name',
        },
        {
            title: '售价/元',
            dataIndex: 'specification_list',
            render: (text: any[], record) => {
                const arr = text.map(item => item.sale_price)
                const min = Math.min.apply(Math, arr)
                const max = Math.max.apply(Math, arr)

                return `${(min / 100).toFixed(2)}~${(max / 100).toFixed(2)}`
            }
        },
        {
            title: '上下架',
            dataIndex: 'use_status',
            width: 150,
            render: (text, record) => (
                <Switch
                    checkedChildren="上架"
                    unCheckedChildren="下架"
                    checked={text ? true : false}
                    onChange={() => onChangeStatus(record.id)}
                />
            )
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
                                setDrawerTitle('编辑商品');
                                (drawerRef.current as any).showDrawer(record, 'edit')
                            }}
                        >
                            编辑
                        </a>
                        &nbsp;
                        <Popconfirm
                            title="你确定删除商品吗?"
                            onConfirm={() => removeTableItem(record.id)}
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        },
    ]

    return (
        <div>
            <SetGoodsDrawer
                title={drawerTitle}
                ref={drawerRef}
                allMajor={allMajor}
                refreshData={refreshData}
                allSchool={allSchool}
            />

            <Form form={form} name="search" layout="inline" onFinish={onFinish}>
                <FormItem
                    name="title"
                >
                    <Input allowClear placeholder="商品名称" />
                </FormItem>
                <FormItem
                    name="province"
                >
                    <Input allowClear placeholder="学校所在省" />
                </FormItem>
                <FormItem
                    name="city"
                >
                    <Input allowClear placeholder="学校所在市" />
                </FormItem>
                <FormItem
                    name="school_id"
                >
                    <Select
                        placeholder="学校"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
                        allowClear
                        style={{ width: 174 }}
                    >
                        {allSchool.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>

                </FormItem>
                <FormItem
                    name="major_id"
                >
                    <Select
                        placeholder="专业"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
                        allowClear
                        style={{ width: 174 }}
                    >
                        {allMajor.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
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
                            setDrawerTitle('添加商品');
                            (drawerRef.current as any).showDrawer({}, 'add')
                        }}
                    >
                        添加商品
                    </Button>
                </FormItem>
            </Form>
            <Table
                columns={columns}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{ marginTop: 16 }}
                onChange={(page) => fetchTableData(page.current)}
                pagination={pagination}
                rowKey={(record) => record.id}
            />
        </div>
    )
}

export default Page

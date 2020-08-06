import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Drawer, Button, Form, Input, Badge, Popconfirm } from 'antd';
import { apiRouter } from 'common/api'
import SubTitle from 'containers/components/subTitle'
import DescribeList from 'containers/components/describeList'
import CustomTable from 'containers/components/customTable'
import ImgPreview from 'containers/components/imgPreview';
import SetContactDrawer from './setContactDrawer'
import { hex_md5 } from "common/utils/security/CryptoMd5"

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
    const [data, setData] = useState<any>({})
    const tableRef = useRef()
    const setContactDrawerRef = useRef()

    const [form] = Form.useForm()

    const showDrawer = (record: any, optType: string) => {
        console.log('record', record)
        setVisible(true)
        setRecord(record)
        setOptType(optType)
        fetchData(record)
    }

    const fetchData = async (record: any) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'agent.get').request({
                agent_id: record.id
            })
            setData(result.agent_info)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const onClose = () => {
        form.resetFields()
        // props.refreshData()
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    const generateAccount = async (record: any) => {
        try {
            const result = await apiRouter.router('crm-pc', 'agent.contacts.updateaccount').request({
                contacts_id: record.id,
                contacts_info: JSON.stringify({
                    account: record.account,//char # 账号
                    password: null,//char # 密码
                    account_status: 'notactive',//char # 状态
                })
            });
            (tableRef.current as any).refreshData(1)
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
            width={771}
            destroyOnClose={true}
        >
            <SubTitle
                title={'基础信息'}
            />

            <SetContactDrawer
                ref={setContactDrawerRef}
                refreshData={tableRef.current && tableRef.current.refreshData}
            />

            <DescribeList
                width={50}
                data={[
                    {
                        label: '代理商',
                        value: data.name,
                    },
                    {
                        label: '信用代码',
                        value: data.license_code,
                    },
                    {
                        label: '省市区',
                        value: `${data.province}-${data.city}${data.area ? '-' + data.area : ''}`,
                    },
                    {
                        label: '详细地址',
                        value: data.address,
                    },
                    {
                        label: '公章',
                        value: data.official_seal ? (
                            <ImgPreview
                                url={data.official_seal}
                                title={'公章'}
                                customerStyle={{
                                    width: 30,
                                    height: 30,
                                    cursor: "pointer"
                                }}
                            />
                        ) : (
                                null
                            ),
                    },
                    {
                        label: '营业执照',
                        value: data.license_picture ? (
                            <ImgPreview
                                url={data.license_picture}
                                title={'公章'}
                                customerStyle={{
                                    width: 30,
                                    height: 30,
                                    cursor: "pointer"
                                }}
                            />
                        ) : (
                                null
                            ),
                    },
                    {
                        label: '入驻时间',
                        value: data.create_time,
                    },
                ]}
            />
            <SubTitle
                title={'联系人信息（管理员账号）'}
                rightCon={(<a onClick={() => (setContactDrawerRef.current as any).showDrawer(record, 'contacts.add')}>添加联系人</a>)}
            />

            <CustomTable
                serverName='crm-pc'
                pagination={true}
                apiName='agent.contacts.search'
                searchParams={{ agent_id: record.id, search_info: JSON.stringify({}) }}
                columns={[
                    {
                        title: '姓名',
                        dataIndex: 'contacts',
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone',
                    },
                    {
                        title: '性别',
                        dataIndex: 'gender',
                        width: 80,
                        render: (text: string) => {
                            const genderMap = {
                                man: '男',
                                woman: '女',
                            }
                            return genderMap[text]
                        }
                    },
                    {
                        title: '邮箱',
                        dataIndex: 'email',
                    },
                    {
                        title: '账号',
                        dataIndex: 'account',
                    },
                    {
                        title: '状态',
                        dataIndex: 'account_status',
                        render: (text, record) => {
                            if (record.account) {
                                let status = ''
                                let txt = ''
                                if (text == 'enable') {
                                    status = 'success'
                                    txt = '启用'
                                } else if (text == 'lock') {
                                    status = 'default'
                                    txt = '锁定'
                                } else if (text == 'disable') {
                                    status = 'error'
                                    txt = '禁用'
                                } else if (text == 'notactive') {
                                    status = 'processing'
                                    txt = '待激活'
                                }
                                return (
                                    <Badge
                                        status={status}
                                        text={txt}
                                    />
                                )
                            }
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'option',
                        render: (text: string, record: any) => (
                            <span>
                                {record.account ? (
                                    <a onClick={() => (setContactDrawerRef.current as any).showDrawer(record, 'contacts.updateaccount')}>编辑账号</a>
                                ) : (
                                        <Popconfirm
                                            title={(
                                                <div>
                                                    <span>初始密码 </span>
                                                    <span style={{ color: 'red' }}>手机号后六位</span> ，
                                                    <div>您确认继续生成吗？</div>
                                                </div>
                                            )}
                                            onConfirm={() => { generateAccount(record) }}
                                        >
                                            <a>
                                                生成账号
                                            </a>
                                        </Popconfirm>
                                    )}
                                    &nbsp;
                                <a onClick={() => (setContactDrawerRef.current as any).showDrawer(record, 'contacts.update')}>编辑联系人</a>
                            </span>
                        )
                    },
                ]}
                ref={tableRef}
            />

        </Drawer>
    )
}

export default forwardRef(App as any)
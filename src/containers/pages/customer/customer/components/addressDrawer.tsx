import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {Badge, Drawer, Table} from 'antd'
import {apiRouter} from 'common/api'

interface DrawerProps {

}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])

    const showDrawer = (record: any) => {
        setVisible(true)
        fetchTableData(record)
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))


    const fetchTableData = async (record: any) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'customer.address.search').request({
                customer_id: record.id
            })
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            title: '收货人',
            dataIndex: 'contacts',
            width:80,
            fixed:'left'
        },
        {
            title: '所在地区',
            dataIndex: 'city',
            width:140,
        },
        {
            title: '详细地址',
            dataIndex: 'address',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            width:120,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            width:80,
            render: (text: string) => {
                const genderMap = {
                    man: '男',
                    woman: '女',
                    unknown: '未知'
                }
                return genderMap[text]
            }
        },
        {
            title: '是否默认',
            width:80,
            dataIndex: 'is_default',
            render: (text) => text ? '是' : '否'
        },
    ]

    return (
        <Drawer
            title={'地址信息'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={669}
        >
            <Table
                columns={columns}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{marginTop: 16}}
                pagination={false}
                scroll={{x:750}}
                rowKey={(record) => record.id}
            />
        </Drawer>
    )
}

export default forwardRef(App as any)
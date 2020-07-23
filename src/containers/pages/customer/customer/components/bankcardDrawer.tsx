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
            const result = await apiRouter.router('crm-pc', 'customer.bankcard.search').request({
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
            title: '银行',
            dataIndex: 'bank_name',
            fixed: 'left',
            width: 150
        },
        {
            title: '银行编码',
            dataIndex: 'bank_code',
            width: 80
        },
        {
            title: '卡尾号',
            dataIndex: 'bank_number',
            width: 80,
            render: (str: string) => str.substring(str.length - 4)
        },
        {
            title: '开户人',
            dataIndex: 'name',
            width: 80,
        },
        {
            title: '开户人手机号',
            dataIndex: 'phone',
            width: 120,
        },
        {
            title: '开户人身份证',
            dataIndex: 'identification',
            width: 180,
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
        },
    ]

    return (
        <Drawer
            title={'地址信息'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={700}
        >
            <Table
                columns={columns}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{marginTop: 16}}
                pagination={false}
                rowKey={(record) => record.id}
                scroll={{x:900}}
            />
        </Drawer>
    )
}

export default forwardRef(App as any)
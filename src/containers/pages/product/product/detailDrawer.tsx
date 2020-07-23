import React, {useState, useImperativeHandle, forwardRef, useEffect, useRef} from 'react'
import {Badge, Drawer, Table} from 'antd'
import {apiRouter} from 'common/api'
import SubTitle from 'containers/components/subTitle';
import DescribeList from 'containers/components/describeList';
import AddCateDrawer from './addCateDrawer'

interface DrawerProps {

}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])
    const addCateRef = useRef()


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


    return (
        <Drawer
            title={'详情'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={669}
        >
            <SubTitle
                title='产品信息'
            />
            <DescribeList
                width={100}
                data={[
                    {
                        label: '产品名称',
                        value: data.nick,
                    },
                    {
                        label: '品牌名称',
                        value: data.phone,
                    },
                ]}
            />
            <SubTitle
                title='属性信息'
                rightCon={(
                    <div>
                        <a style={{fontSize: 14}} onClick={()=>addCateRef.current.showDrawer({},'add')}>添加分类</a>
                    </div>
                )}
            />
            <Table
                columns={[
                    {
                        title: '分类名称',
                        dataIndex: 'contacts',
                    },
                    {
                        title: '属性',
                        dataIndex: 'city',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'address',
                    },
                ]}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{marginTop: 16}}
                pagination={false}
                rowKey={(record) => record.id}
            />

            <AddCateDrawer
                ref={addCateRef}
            />
        </Drawer>
    )
}

export default forwardRef(App as any)
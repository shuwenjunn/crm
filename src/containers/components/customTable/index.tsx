import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Table } from 'antd'
import { apiRouter } from 'common/api'

interface Iprops {
    columns: any[]
    pagination: boolean
    searchParams: any
    apiName: string
    serverName: string
}

const Index: React.FC<Iprops> = (props, ref) => {

    const [pagination, setPagination] = useState<any>({ showQuickJumper: false, current: 1 })
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTableData()
    }, [])

    const fetchTableData = async (current = 1) => {
        setLoading(true)
        try {
            const params = {
                ...props.searchParams,
                current_page: current
            }
            console.log('params-------->>>', params)
            const result = await apiRouter.router(props.serverName, props.apiName).request(params)
            props.pagination && setPagination({ ...pagination, total: result.total, current: current })
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshData = (current?: number) => {
        fetchTableData(current ? current : pagination.current)
    }

    useImperativeHandle(ref, () => ({
        refreshData
    }))

    return (
        <div>
            <Table
                columns={props.columns}
                dataSource={data}
                size={'small'}
                loading={loading}
                style={{ marginTop: 16 }}
                onChange={(page) => fetchTableData(page.current)}
                pagination={props.pagination ? pagination : false}
                rowKey={(record: any) => record.id}
            />
        </div>
    )
}

export default forwardRef(Index as any)
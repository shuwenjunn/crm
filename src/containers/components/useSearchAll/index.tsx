import React, { useState, useEffect } from 'react'
import { apiRouter } from 'common/api'
import { api } from 'config'

function useSearchAll(apiName: string): any[] {
    const [data, setData] = useState([])

    const fetchData = async (apiName: string) => {
        try {
            const result = await apiRouter.router('crm-pc', apiName).request({})
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {

        }

    }

    useEffect(() => {
        fetchData(apiName)
    }, [])

    return data
}

export default useSearchAll
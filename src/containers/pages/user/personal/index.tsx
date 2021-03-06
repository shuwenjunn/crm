import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { connect } from 'react-redux';
import { RootState, userRedux } from 'reduxes';
import { apiRouter } from 'common/api'
import DescribeList from 'containers/components/describeList'
import { bindActionCreators, Dispatch } from "redux";
import { IGender } from 'common/interface'

export interface UserInfoProps {
    user: RootState['user'],
    getData: any,
    history: any
}

const App: React.FC<UserInfoProps> = (props, ref) => {
    const [data, setData] = useState<any>({ department_role_list: [] })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async (current = 1) => {
        try {
            const result = await apiRouter.router('crm-pc', 'staff.myself.get').request({})
            setData(result.staff_info)
        } catch (error) {
            console.log('error------->>', error)
        } finally {

        }
    }

    const genderMap: IGender = {
        man: '男',
        woman: '女',
        unknow: '未知',
    }

    return (
        <div style={{ padding: 60 }}>
            <DescribeList
                data={[
                    { label: '姓名', value: data.name },
                    { label: '性别', value: genderMap[(data.gender as keyof IGender)] },
                    { label: '昵称', value: data.nick },
                    { label: '工号', value: data.work_number },
                    {
                        label: '部门职位',
                        value: (
                            <div>
                                {data.department_role_list.map((item: any) => {
                                    return (
                                        <span
                                            key={item.department_name}
                                        >
                                            {item.department_name}-{item.role_name}
                                        </span>
                                    )
                                })}
                                {data.department_role_list <= 0 ? '暂无数据' : null}
                            </div>
                        ),
                    },
                    { label: '生日', value: data.birthday },
                    { label: '手机号', value: data.phone },
                    { label: '邮箱', value: data.email },
                ]}
                width={100}
            />
        </div>
    )
}

export default connect(
    (state: Pick<RootState, 'user'>, ownProps): Pick<UserInfoProps, 'user'> => {
        return { user: state.user };
    },
    (dispatch: Dispatch): Pick<UserInfoProps, 'getData'> => {
        return {
            getData: bindActionCreators(userRedux.actions(), dispatch),
        };
    }
)(forwardRef(App as any))
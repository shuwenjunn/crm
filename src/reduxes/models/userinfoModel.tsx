'use strict'

interface IdepartmentAndRole {
    role_id: number //int # 部门id
    role_name: string//char # 角色名称
    department_id: number//int # 部门id
    department_name: string//char # 部门名称
    department_role_id: number//int # 部门角色id
}

/** Login model definitions **/
export interface UserinfoModel {
    work_number: number,//char # 员工工号
    gender: 'man' | 'woman' | 'unknown',// char # 性别
    department_role_list: IdepartmentAndRole[]
    head_url: string// char # 头像
    is_admin: boolean// boolean # 是否是管理员
    phone: string | number// char # 电话
    email: string// char # 邮箱
    name: string// char # 姓名
    birthday: string// char # 生日
    nick: string// char # 昵称
    isLoading: boolean
}




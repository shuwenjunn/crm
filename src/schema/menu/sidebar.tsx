'use strict'


import * as icons from '@ant-design/icons';
import {MenuElementInterface} from 'common/interface';


export const sidebarMenu: MenuElementInterface[] = [
    {
        key: 'staff',
        name: '组织结构',
        icon: icons.HomeOutlined,
        router: "/",
        child: [
            {
                key: 'department',
                name: '部门列表',
                icon: icons.ClusterOutlined,
                router: "/one",
            },
            {
                key: 'sublist',
                name: '员工列表',
                icon: icons.TeamOutlined,
                router: "/two",
            },
        ],
    },
    {
        key: 'customer',
        name: '客户管理',
        icon: icons.HomeOutlined,
        router: "/customer",
        child: [
            {
                key: 'customer',
                name: '客户列表',
                icon: icons.ClusterOutlined,
                router: "/customer",
            },
        ],
    },
    {
        key: 'product',
        name: '产品管理',
        icon: icons.HomeOutlined,
        child: [
            {
                key: 'brand',
                name: '品牌列表',
                icon: icons.ClusterOutlined,
                router: "/brand",
            },
        ],
    },
    {
        key: 'goods',
        name: '商品管理',
        icon: icons.HomeOutlined,
        child: [
            {
                key: 'goods',
                name: '商品列表',
                icon: icons.ClusterOutlined,
                router: "/goods",
            },
        ],
    },
];

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
                router: "/one",
            },
            {
                key: 'sublist',
                name: '员工列表',
                router: "/two",
            },
        ],
    },
    {
        key: 'customer',
        name: '客户管理',
        icon: icons.TeamOutlined,
        router: "/customer",
        child: [
            {
                key: 'customer',
                name: '客户列表',
                router: "/customer",
            },
        ],
    },
    {
        key: 'product',
        name: '产品管理',
        icon: icons.GoldOutlined,
        child: [
            {
                key: 'brand',
                name: '品牌列表',
                router: "/brand",
            },
            {
                key: 'product',
                name: '产品列表',
                router: "/product",
            },
        ],
    },
    {
        key: 'goods',
        name: '商品管理',
        icon: icons.ShopOutlined,
        child: [
            {
                key: 'goods',
                name: '商品列表',
                router: "/goods",
            },
            {
                key: 'school',
                name: '学校列表',
                router: "/school",
            },
            {
                key: 'major',
                name: '专业列表',
                router: "/major",
            },
        ],
    },
    {
        key: 'sms',
        name: '短信列表',
        icon: icons.MessageOutlined,
        child: [
            {
                key: 'sms',
                name: '短信列表',
                router: "/sms",
            },

        ],
    },
];

'use strict'


import * as icons from '@ant-design/icons';
import { MenuElementInterface } from 'common/interface';


export const headerMenu: MenuElementInterface[] = [
    {
        key: 'userMenu',
        name: "用户菜单",
        child: [
            {
                key: 'user',
                name: '个人',
                child: [
                    {
                        key: 'personal',
                        name: '个人详情',
                        router: '/personal',
                        icon: icons.UserOutlined,
                    },
                    {
                        key: 'modify',
                        name: '修改密码',
                        router: '/modifiyPassword',
                        icon: icons.EditOutlined,
                    },
                ],
            },
        ],
    },
    {
        key: 'notice',
        name: '公告',
        icon: icons.SoundOutlined,
        child: [
            {
                key: 'system',
                name: '系统公告',
                icon: icons.ContainerOutlined,
            },
            {
                key: 'person',
                name: '个人消息',
                icon: icons.MessageOutlined,
            },
        ],
    },
    {
        key: 'logger',
        name: '操作日志',
        icon: icons.ProfileOutlined,
        child: [
            {
                key: 'system',
                name: '系统日志',
                icon: icons.HddOutlined,
            },
        ],
    },
];

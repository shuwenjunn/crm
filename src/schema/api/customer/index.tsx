'use strict'


import {ApiInterface} from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const customerApi: ApiInterface[] = [
    {
        name: "customer.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            {attr: 'search_info', type: fields.StringField},
            {attr: 'current_page', type: fields.StringField},
        ],
        response: [
            {attr: 'total_page', type: fields.NumberField},
            {attr: 'total', type: fields.NumberField},
            {attr: 'data_list', type: fields.NumberField},
        ],
        mock: {
            success: {
                total: 1,
                total_page: 1,
                data_list: [
                    {
                        phone: 15527377390,//char # 手机号
                        head_url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=870646017,1182895394&fm=26&gp=0.jpg',//char # 头像
                        nick: '舒文俊',// char # 昵称
                        birthday: '1995-01-02',// char # 生日
                        id: 1, //int # 客户编号
                        email: '1132670475@qq.com',// char # 邮箱
                        gender: 'man',// char # 性别
                        qq: '11326709465',// char # qq
                        wechat: 'shuwenjun',// char # 微信
                        name: '舒文俊',//char # 姓名
                    }
                ]
            },
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "customer.get",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            {attr: 'customer_id', type: fields.NumberField},
        ],
        response: [
            {attr: 'customer_info', type: fields.StringField},
        ],
        mock: {
            success: {
                customer_info: {
                    phone: 15527377390,//char # 手机号
                    head_url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=870646017,1182895394&fm=26&gp=0.jpg',//char # 头像
                    nick: '舒文俊',// char # 昵称
                    birthday: '1995-01-02',// char # 生日
                    id: 1, //int # 客户编号
                    email: '1132670475@qq.com',// char # 邮箱
                    gender: 'man',// char # 性别
                    qq: '11326709465',// char # qq
                    wechat: 'shuwenjun',// char # 微信
                    name: '舒文俊',//char # 姓名
                }
            },
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "customer.address.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            {attr: 'customer_id', type: fields.NumberField},
        ],
        response: [
            {attr: 'data_list', type: fields.NumberField},
        ],
        mock: {
            success: {
                total: 0,
                total_page: 0,
                data_list: []
            },
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "customer.bankcard.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            {attr: 'customer_id', type: fields.NumberField},
        ],
        response: [
            {attr: 'data_list', type: fields.NumberField},
        ],
        mock: {
            success: {
                total: 0,
                total_page: 0,
                data_list: []
            },
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "customer.transaction.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            {attr: 'customer_id', type: fields.NumberField},
            {attr: 'current_page', type: fields.StringField},
        ],
        response: [
            {attr: 'total_page', type: fields.NumberField},
            {attr: 'total', type: fields.NumberField},
            {attr: 'data_list', type: fields.NumberField},
        ],
        mock: {
            success: {
                total: 0,
                total_page: 0,
                data_list: []
            },
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
]

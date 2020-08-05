'use strict'


import { ApiInterface } from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const merchantApi: ApiInterface[] = [
    {
        name: "agent.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            { attr: 'search_info', type: fields.StringField },
            { attr: 'current_page', type: fields.StringField },
        ],
        response: [
            { attr: 'total_page', type: fields.NumberField },
            { attr: 'total', type: fields.NumberField },
            { attr: 'data_list', type: fields.NumberField },
        ],
        mock: {
            success: {
                total: 1,
                total_page: 1,
                data_list: [
                    {
                        id: 1,//int # 品牌id
                        name: 'biquan',//char # 品牌名称
                        industry: '教育',//char # 行业
                        description: '必圈牛逼',//char # 品牌描述
                        create_time: '2020-09-10',//datetime # 添加时间
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
        name: "agent.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'agent_info', type: fields.StringField },
        ],
        response: [],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "agent.update",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'agent_info', type: fields.StringField },
            { attr: 'agent_id', type: fields.NumberField },
        ],
        response: [],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "agent.get",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'agent_id', type: fields.NumberField },
        ],
        response: [
            { attr: 'agent_info', type: fields.StringField },
        ],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "agent.contacts.search",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [
            { attr: 'search_info', type: fields.StringField },
            { attr: 'agent_id', type: fields.NumberField },
            { attr: 'current_page', type: fields.StringField },
        ],
        response: [
            { attr: 'total_page', type: fields.NumberField },
            { attr: 'total', type: fields.NumberField },
            { attr: 'data_list', type: fields.NumberField },
        ],
        mock: {
            success: {
                total: 1,
                total_page: 1,
                data_list: [
                    {
                        id: 1,//int # 品牌id
                        name: 'biquan',//char # 品牌名称
                        industry: '教育',//char # 行业
                        description: '必圈牛逼',//char # 品牌描述
                        create_time: '2020-09-10',//datetime # 添加时间
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
        name: "agent.contacts.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'contacts_info', type: fields.StringField },
            { attr: 'agent_id', type: fields.NumberField },
        ],
        response: [],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },

    {
        name: "agent.contacts.update",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'contacts_id', type: fields.NumberField },
            { attr: 'contacts_info', type: fields.StringField },
        ],
        response: [],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
    {
        name: "agent.contacts.updateaccount",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            { attr: 'contacts_id', type: fields.NumberField },
            { attr: 'contacts_info', type: fields.StringField },
        ],
        response: [],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
]

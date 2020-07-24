'use strict'


import {ApiInterface} from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const productApi: ApiInterface[] = [
    {
        name: "production.brand.search",
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
        name: "production.search",
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
        name: "production.brand.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'brand_info', type: fields.StringField},
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
        name: "production.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'name', type: fields.StringField},
            {attr: 'description', type: fields.StringField},
            {attr: 'attribute_list', type: fields.StringField},
            {attr: 'workflow_list', type: fields.StringField},
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
        name: "production.brand.update",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'brand_info', type: fields.StringField},
            {attr: 'brand_id', type: fields.NumberField},
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
        name: "production.brand.remove",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'brand_id', type: fields.NumberField},
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

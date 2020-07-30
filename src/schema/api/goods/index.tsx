'use strict'


import {ApiInterface} from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const goodsApi: ApiInterface[] = [
    {
        name: "university.school.search",
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
        name: "university.school.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'school_info', type: fields.StringField},
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
        name: "university.school.update",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'school_id', type: fields.NumberField},
            {attr: 'school_info', type: fields.StringField},
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
        name: "university.school.remove",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'school_id', type: fields.NumberField},
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
        name: "university.school.settop",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'school_id', type: fields.NumberField},
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
        name: "university.major.search",
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
        name: "university.major.add",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'major_info', type: fields.StringField},
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
        name: "university.major.update",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'major_id', type: fields.NumberField},
            {attr: 'major_info', type: fields.StringField},
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
        name: "university.major.remove",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'major_id', type: fields.NumberField},
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
        name: "university.major.settop",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'major_id', type: fields.NumberField},
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
        name: "university.school.searchall",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [

        ],
        response: [
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
        name: "university.major.searchall",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [

        ],
        response: [
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
]

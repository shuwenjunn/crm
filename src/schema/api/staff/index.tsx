'use strict'


import {ApiInterface} from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const staffApi: ApiInterface[] = [
    {
        name: "staff.myself.get",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi, //??
        request: [],
        response: [
            {attr: 'staff_info', type: fields.NumberField}
        ],
        mock: {
            success: {},
            failure: {
                code: '9999',
                msg: '获取数据失败',
            }
        }
    },
]

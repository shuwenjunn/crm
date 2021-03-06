'use strict'


import { ApiInterface } from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const userApi: ApiInterface[] = [
    { 
        name: "staff.account.login",
        descriptions: "it will login by username and password",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'username', type: fields.StringField},
            {attr: 'password', type: fields.StringField},
        ],
        response:[
            {attr: 'access_token', type: fields.StringField},
            {attr: 'renew_flag', type: fields.StringField},
            {attr: 'expire_time', type: fields.StringField},
        ],
        mock: {
            success:{
                access_token: '123456',
                renew_flag: '654321',
                expire_time: '2019-01-02',
            },
            failure:{
                code: '9999',
                msg: '账号密码错误',
            }
        }
    },
    { 
        name: "staff.account.password.modify",
        descriptions: "",
        servers: ["crm-pc", 'test'],
        type: api.UnAuthorizationApi,
        request: [
            {attr: 'new_password', type: fields.StringField},
            {attr: 'old_password', type: fields.StringField},
            {attr: 'repeat_password', type: fields.StringField},
        ],
        response:[
        ],
        mock: {
            success:{

            },
            failure:{
                code: '9999',
                msg: '账号密码错误',
            }
        }
    }
]

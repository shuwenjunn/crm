'use strict'

import { ServerInterface } from 'common/interface';


export const serverConfig: ServerInterface[] = [
    {
        flag: 'crm-pc',
        url: "http://192.168.3.201:3000/interface/",
        description: "crm系统服务"
    },
    {
        flag: 'test',
        url: "http://localhost:8012/interface/",
        description: "test系统服务"
    },
]

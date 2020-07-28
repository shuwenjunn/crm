'use strict'

import {ServerInterface} from 'common/interface';


export const serverConfig: ServerInterface[] = [
    {
        flag: 'crm-pc',
        url: "http://education.bq.com/interface/",
        // url: "http://192.168.3.201:3000/interface/",
        description: "crm系统服务"
    },
    {
        flag: 'test',
        url: "http://192.168.3.201:3000/interface/",
        description: "crm系统服务"
    },
    {
        flag: 'file',
        url: "http://192.168.3.201:3000/interface/",
        description: "crm上传"
    },
]

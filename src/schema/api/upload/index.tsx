'use strict'


import {ApiInterface} from 'common/interface';
import * as fields from 'common/api/fields';
import * as api from 'common/api/core';

export const uploadApi: ApiInterface[] = [
    {
        name: "file.upload",
        descriptions: "图片上传",
        servers: ['file'],
        type: api.UnAuthorizationApi,
        request: [
            // {attr: '_upload_files', type: fields.StringField},
            // {attr: 'role', type: fields.StringField},
            // {attr: 'store_type', type: fields.StringField},
        ],
        response: [
            {attr: 'file_paths', type: fields.StringField},
        ],
        mock: {
            success: {
                file_paths: []
            },
        }
    }
]

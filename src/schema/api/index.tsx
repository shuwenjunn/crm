'use strict'


import { userApi } from './user';
import { customerApi } from './customer';
import { uploadApi } from './upload';


export const apiConfig = [
    ...userApi,
    ...customerApi,
    ...uploadApi
]

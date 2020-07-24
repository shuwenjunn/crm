'use strict'


import { userApi } from './user';
import { customerApi } from './customer';
import { uploadApi } from './upload';
import { productApi } from './product';


export const apiConfig = [
    ...userApi,
    ...customerApi,
    ...uploadApi,
    ...productApi
]

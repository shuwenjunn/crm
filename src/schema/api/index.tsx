'use strict'


import { userApi } from './user';
import { customerApi } from './customer';
import { uploadApi } from './upload';
import { productApi } from './product';
import { staffApi } from './staff';


export const apiConfig = [
    ...userApi,
    ...customerApi,
    ...uploadApi,
    ...staffApi,
    ...productApi
]

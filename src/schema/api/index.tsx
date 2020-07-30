'use strict'


import { userApi } from './user';
import { customerApi } from './customer';
import { uploadApi } from './upload';
import { productApi } from './product';
import { staffApi } from './staff';
import { goodsApi } from './goods';
import { smsApi } from './sms';


export const apiConfig = [
    ...userApi,
    ...customerApi,
    ...uploadApi,
    ...staffApi,
    ...goodsApi,
    ...productApi,
    ...smsApi,
]

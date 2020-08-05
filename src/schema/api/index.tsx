'use strict'


import { userApi } from './user';
import { customerApi } from './customer';
import { uploadApi } from './upload';
import { productApi } from './product';
import { staffApi } from './staff';
import { goodsApi } from './goods';
import { smsApi } from './sms';
import { orderApi } from './order';
import { merchantApi } from './merchant';


export const apiConfig = [
    ...userApi,
    ...customerApi,
    ...uploadApi,
    ...staffApi,
    ...goodsApi,
    ...productApi,
    ...smsApi,
    ...orderApi,
    ...merchantApi,
]

'use strict'


import { userApi } from './user';
import { customerApi } from './customer';


export const apiConfig = [
    ...userApi,
    ...customerApi
]

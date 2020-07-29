'use strict'


import * as models from 'reduxes/models';

export interface RootState {
    login: Partial<models.AccountModel>;
    // 用户信息
    user: Partial<models.UserinfoModel>;
    app: Partial<models.AppModel>;
    router?: any;
}


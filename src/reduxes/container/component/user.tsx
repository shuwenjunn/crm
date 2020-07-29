'use strict'


import { handleActions } from 'redux-actions';


import { BaseContainer } from '../base';
import { RootState } from '../state';
import * as models from 'reduxes/models';

export enum ActionType {
    FETCH_DATA = 'FETCH_DATA'
}

export class UserinfoContainer extends BaseContainer {
    initialState: any;
    getUserinfo: any;

    constructor(initialState: any){
        super(initialState);

        this.initialState = initialState;
        this.getUserinfo = this.createAsynchronizationAction('crm-pc', ActionType.FETCH_DATA);
    }

    actions(): any{
        return {
            getUserinfo: this.getUserinfo,
        }
    }

    reducer(): any{
        return handleActions<Pick<RootState,'user'> , models.UserinfoModel>(
            {
                [this.getUserinfo.pending.toString()]: (state, action) => {
                    console.log('action进行中')
                    return Object.assign({}, state, {
                        isLoading: true
                    });
                },
                [this.getUserinfo.fulfilled.toString()]: (state, action) => {
                    console.log('action成功了')
                    return Object.assign({}, state, {
                        isLoading: false
                    })
                },
                [this.getUserinfo.rejected.toString()]: (state, action) => {
                    console.log('action失败了')
                    return Object.assign({}, state, {
                        isLoading: false
                    })
                },
            },
            this.initialState
        );
    }

}

export const userRedux = new UserinfoContainer({});

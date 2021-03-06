'use strict'


import { ServerRegister } from './server';
import { BaseApi } from 'common/api/core';

import { apiConfig } from "schema/api";


export class ApiRouter{
    serverRegister: ServerRegister;

    constructor(apiConfig: any){
        this.serverRegister = new ServerRegister()
        this.loadApi(apiConfig)

        console.log('api regist is running')
    }

    router(serverFlag: string, apiName: string): BaseApi{
        return this.serverRegister.serverHelper[serverFlag].apiRegister.apiHelper[apiName]
    }

    checkApi(api: any){
        let fields = [ 'name', 'descriptions', 'servers', 'type', 'request', 'response']
        let loseFields = [];
        for(let field of fields){
            if(!api.hasOwnProperty(field)){
                console.log(field, api, api.hasOwnProperty(field))
                loseFields.push(field);
            }
        }
        return loseFields;
    }

    loadApi(apiConfig: any){
        for(let api of apiConfig){
            let loseFields = this.checkApi(api);
            if(loseFields.length){
                throw new Error(`[ notes ] api losed paramter !!! -> ${loseFields.toString()}`)
            } else {
                for(let serverName of api.servers){
                    let serverHelper = this.serverRegister.serverHelper;
                    if( !serverHelper.hasOwnProperty(serverName) ){
                        throw new Error(`[ notes ] ${serverName} was not registed ...`)
                    }
                    let { server, apiRegister } = serverHelper[serverName];

                    let apiObj = new api.type(api.name, server, api.descriptions);
                    
                    api.request.map(
                        (item: any) => {
                            let fieldObj = new item.type();
                            apiObj.parmsHelper.addField(item.attr, fieldObj);
                        }
                    );
                    api.response.map(
                        (item: any) => {
                            let fieldObj = new item.type();
                            apiObj.returnHelper.addField(item.attr, fieldObj);
                        }
                    );
                    apiObj.mockData =  api.mock;
                    apiRegister.register(apiObj);
                }
            }
        }
    }

    toString(){
        for(let serverFlag in this.serverRegister.serverHelper){
            let { apiRegister } = this.serverRegister.serverHelper[serverFlag];
            for(let apiName in apiRegister){
                console.info('----->>>>>   ', serverFlag, apiName)
            }
        }
    }

}


export const apiRouter = new ApiRouter(apiConfig);

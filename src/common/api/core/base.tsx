'use strict'


import * as config from '&/config.js';
import { message } from 'antd';
import { HttpRequest } from 'common/utils/channel/http';
import { signatureHelper } from 'common/api/tools';
import { FieldSetHelper } from 'common/api/fieldSet';
import { Server } from 'common/api/server'
import { TokenEnum, TokenConstant } from 'common/utils/persistence';

export abstract class BaseApi {

    name: string;
    description: string;
    accessUrl: string;
    server: Server;
    parmsHelper: FieldSetHelper;
    returnHelper: FieldSetHelper;
    mockData: any;

    constructor(name: string, server: Server, description: string = "") {
        this.name = name;
        this.description = description;
        this.parmsHelper = new FieldSetHelper();
        this.returnHelper = new FieldSetHelper();
        this.server = server;
        this.accessUrl = this._getApiUrl();
    }

    _getApiUrl(): string {
        return this.server.url;
    }

    _getToken() {
        return TokenConstant.get() ? TokenConstant.get()[TokenEnum.ACCESS_TOKEN] : undefined
    }

    _generateProtocolHeader(): any {
        this._getToken()
        return {
            'auth': this._getToken(),
            'flag': this.server.flag,
            'api': this.name,
            'timestamp': Date.parse(new Date().toJSON()),
        }
    }

    _parseResponseHeader(response: any): any {
        let isSuccess: boolean = response.status === 'ok';
        let result: any;
        if (isSuccess) {
            result = response.result;
        } else {
            result = {
                code: response.code,
                msg: response.msg,
            }
        }
        return {
            isSuccess,
            result
        }
    }

    request(params: any) {
        let requestParms = this.parmsHelper.parse(params)
        let header = this._generateProtocolHeader();
        let request = Object.assign({}, header, requestParms)
        request['sign'] = signatureHelper.getSignature(request)
        console.log("我正在请求服务器")

        if (config.debug) {
            return new Promise(
                (resolve, reject) => {
                    // var timeOut = Math.random() * 2;
                    var timeOut = 0
                    setTimeout(function () {
                        console.log("我得到了假数据返回的结果")
                        if (timeOut < 1) {
                            resolve('200 OK');
                        } else {
                            reject('timeout in ' + timeOut + ' seconds.');
                        }
                    }, timeOut * 1000);
                }
            ).then(
                (res) => {
                    return this.receive(this.mockData.success);
                }
            ).catch(
                (res) => {
                    message.warn(this.mockData.failure.msg);
                    // interrupt promise list
                    throw new Error(this.mockData);
                    // return result
                }
            );
        } else {
            return HttpRequest.post(
                this.accessUrl,
                request
            ).then((res) => {
                console.log("我得到了服务器的结果")
                let { isSuccess, result } = this._parseResponseHeader(res)
                console.log('res--->>>>>>>>>>>', res)
                if (!isSuccess) {
                    message.warn(result.msg)

                    throw new Error(result.msg);

                } else {
                    result = this.receive(result);
                    if (result.code === '30007') {
                        TokenConstant.remove()
                    }
                }
                return result;
            });
        }
    }

    /**
     * 上传
     * @param params
     */
    upload(fileData: any, extraParams: any) {
        let header = this._generateProtocolHeader();
        let request = Object.assign({}, header, extraParams)
        request['sign'] = signatureHelper.getSignature(request)
        let formData = new FormData()
        for (let key in request) {
            formData.append(key, request[key])
        }
        formData.append(fileData.fileName, fileData.fileObj)
        return HttpRequest.file(
            this.accessUrl,
            formData
        ).then((res) => {
            let { isSuccess, result } = this._parseResponseHeader(res)
            if (!isSuccess) {
                message.warn(result.msg)
                throw new Error(result.msg);
            } else {
                result = this.receive(result);
            }
            return result;
        });
    }


    receive(result: any): any {
        let responseResult = this.returnHelper.parse(result);
        return responseResult;
    }

    toString(): string {
        return "";
    }

}

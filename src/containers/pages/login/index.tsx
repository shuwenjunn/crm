'use strict'


import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Form, Input, Button, Checkbox } from 'antd';


import * as config from '&/config.js';
import { RootState, loginRedux } from 'reduxes';
// import * as classNames from 'classnames';
// import * as style from './index.less';
import { TokenEnum, TokenConstant } from 'common/utils/persistence';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { hex_md5 } from "common/utils/security/CryptoMd5"
import IpconfigModal from 'containers/components/tools'

import './index.less';


export interface LoginProps {
    login: RootState['login'],
    loginHelper: any,
    history: any
}

@connect(
    (state: Pick<RootState, 'login'>, ownProps): Pick<LoginProps, 'login'> => {
        return { login: state.login };
    },
    (dispatch: Dispatch): Pick<LoginProps, 'loginHelper'> => {
        return {
            loginHelper: bindActionCreators(loginRedux.actions(), dispatch),
        };
    }
)
export class Login extends React.PureComponent<LoginProps> {

    static defaultProps: Partial<LoginProps> = {};

    constructor(props: LoginProps, context?: any) {
        super(props, context);
        
        console.log('context',context)

        this.handleUsernameInput = this.handleUsernameInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.login.username = event.target.value;
    };

    handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.login.password = hex_md5(event.target.value);
    };

    handleSubmit = async () => {
        const { login, loginHelper } = this.props;
        loginHelper.loginAccount("staff.account.login", login).then(
            (res: any) => {
                TokenConstant.save({
                    [TokenEnum.ACCESS_TOKEN]: res.value.access_token,
                    [TokenEnum.RENEW_FLAG]: res.value.renew_flag,
                    [TokenEnum.EXPIRE_TIME]: res.value.expire_time,
                });
                this.props.history.push("/");
            }
        )
    };

    render() {
        return (
            <div id="login-component">
                <IpconfigModal/>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.handleSubmit}
                >
                    <h2>{config.name}</h2>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入账号' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="账号"
                            onChange={this.handleUsernameInput}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            onChange={this.handlePasswordInput}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住密码</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                            disabled={this.props.login.isLoading}>
                            登陆
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
};

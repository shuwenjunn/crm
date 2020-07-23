'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ConfigProvider} from 'antd';
import {Provider} from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';

import {configureStore} from 'reduxes/store';
import {RouterHelper} from 'routes';

import 'assets/style/global.less';


// prepare store
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <RouterHelper/>
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);

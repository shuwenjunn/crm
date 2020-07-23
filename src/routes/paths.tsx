'use strict'


import {RouteConfig} from 'react-router-config';
import {App} from 'containers/app';
import {Login} from 'containers/pages/login';
import {One} from 'containers/pages/one';
import {Two} from 'containers/pages/two';
import {Welcome} from 'containers/pages/welcome';

import Customer from 'containers/pages/customer/customer'
import Brand from 'containers/pages/product/brand'
import Goods from 'containers/pages/goods/goods'

export const paths: RouteConfig[] = [
    {
        path: "/login",
        component: Login as any,
    },
    {
        path: "/",
        component: App as any,
        routes: [
            {
                path: "/one",
                exact: true,
                component: One as any,
            },
            {
                path: "/two",
                exact: true,
                component: Two as any,
            },
            {
                path: "/welcome",
                exact: true,
                component: Welcome as any,
            },
            {
                path: "/customer",
                exact: true,
                component: Customer as any,
            },
            {
                path: "/brand",
                exact: true,
                component: Brand as any,
            },
            {
                path: "/goods",
                exact: true,
                component: Goods as any,
            },
        ]
    },

]

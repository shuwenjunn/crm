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
import School from 'containers/pages/goods/school'
import Major from 'containers/pages/goods/major'
import Product from 'containers/pages/product/product'
import Personal from 'containers/pages/user/personal'
import ModifiyPassword from 'containers/pages/user/modifiyPassword'
import Sms from 'containers/pages/sms/sms'

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
                path: "/product",
                exact: true,
                component: Product as any,
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
            {
                path: "/school",
                exact: true,
                component: School as any,
            },
            {
                path: "/major",
                exact: true,
                component: Major as any,
            },
            {
                path: "/personal",
                exact: true,
                component: Personal as any,
            },
            {
                path: "/modifiyPassword",
                exact: true,
                component: ModifiyPassword as any,
            },
            {
                path: "/sms",
                exact: true,
                component: Sms as any,
            },
        ]
    },

]

'use client'
import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import zhCN from 'antd/locale/zh_CN';
import theme from '../theme/themeConfig';
import "../styles/globals.scss";
import { RecoilRoot } from 'recoil';

const App = ({ Component, pageProps }: AppProps) => (
    <ConfigProvider theme={theme} locale={zhCN}>
        <RecoilRoot>
            <Component {...pageProps} />
        </RecoilRoot>
    </ConfigProvider>
);

export default App;

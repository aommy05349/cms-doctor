import '../assets/styles/globals.scss';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { apiApp } from '../services/config';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

console.log('app init');
const tokenAuth = getCookie('cms-doctor-cookie');
if (tokenAuth) {
    apiApp.defaults.headers.common['Authorization'] = 'Bearer ' + tokenAuth;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);
    return getLayout(<Component {...pageProps} />);
}

export default MyApp;

import '../assets/styles/globals.scss';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);
    return getLayout(<Component {...pageProps} />);
}

export default MyApp;

// import '../assets/styles/globals.scss';
// import type { AppProps } from 'next/app';
// import type { ReactElement, ReactNode } from 'react';
// import type { NextPage } from 'next';
// import { SessionProvider } from 'next-auth/react';

// type NextPageWithLayout = NextPage & {
//     getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout = AppProps & {
//     Component: NextPageWithLayout;
// };

// function MyApp({
//     Component,
//     pageProps: { session, ...pageProps },
// }: AppPropsWithLayout) {
//     const getLayout = Component.getLayout ?? ((page) => page);
//     return (
//         <SessionProvider session={session}>
//             {getLayout(<Component {...pageProps} />)}
//         </SessionProvider>
//     );
// }

// export default MyApp;

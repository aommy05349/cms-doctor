import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="th">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.png" />
                <title>CMS Doctor Tele Migraine</title>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

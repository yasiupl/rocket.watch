import '@/styles/globals.css';
import 'materialize-css/dist/css/materialize.min.css';
import Layout from '@/components/Layout';
import Head from 'next/head';

// Font Awesome setup
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent Font Awesome from adding CSS automatically since it's being imported above
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

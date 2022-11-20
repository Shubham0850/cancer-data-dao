import "../styles/main.scss";
import "bootstrap/dist/css/bootstrap.css";


import Head from "next/head";
import Web3Provider from "@/components/Web3Provider";
import Footer from "@/components/home/Footer";
import Nav from "@/components/Header";

function Layout({ children }) {
  return (
    <Web3Provider>
      <Nav />
      {children}
      <Footer />
    </Web3Provider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;

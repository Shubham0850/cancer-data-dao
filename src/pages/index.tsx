import Header from "@/components/home/Header";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cancer Data DAO</title>
        <meta name="description" content="Cancer data dao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
    </div>
  );
}

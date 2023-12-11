import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white min-h-screen">
      <Head>
        <title>AMIGOS ODYSSEY MINT</title>
        <meta
          name="description"
          content="🎉 *Introducing AO MINT: Your Gateway to Amigos Odyssey NFTs! 🚀*"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>AMIGOS ODYSSEY MINT</title>
        <meta
          name="description"
          content="🎉 *Introducing AO MINT: Your Gateway to Amigos Odyssey NFTs! 🚀*"
        />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.

  // You can then pass any data you want
  // to the page component here.
  return {
    props: {
      address,
      session,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function Home({ address }: AuthenticatedPageProps) {
  console.log({ address });
  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-screen flex items-center justify-center overflow-hidden bg-black text-bpr-green relative">
        <a href="sms:+12058838339">
          <div className="absolute top-0 w-full text-center p-4 cursor-pointer bg-black backdrop-blur-lg text-xl uppercase font-mono tracking-wider">
            <p>Text me. Do it.</p>
            <p>+1 205-883-8339</p>
          </div>
        </a>
        <video
          className="w-full"
          src="/beeper_promo.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </main>
      <footer>
        {address ? (
          <h1>Authenticated as {address}</h1>
        ) : (
          <h1>Unauthenticated</h1>
        )}
        <ConnectButton />
      </footer>
    </div>
  );
}

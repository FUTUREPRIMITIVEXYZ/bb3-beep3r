import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SendMessage from "../components/sendMessage";

export default function Home() {
  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full p-4 h-screen overflow-hidden bg-black text-bpr-green relative">
        <a href="sms:+12058838339">
          <div className="absolute top-0 w-full text-center p-4 cursor-pointer bg-black backdrop-blur-lg text-xl uppercase font-mono tracking-wider">
            <p>Text +1 205-883-8339</p>
            <p>to claim your beeper NFT</p>
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
        <SendMessage />
      </main>
    </div>
  );
}

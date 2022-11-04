import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-screen flex items-center justify-center overflow-hidden bg-black text-bpr-green relative">
        <p className="absolute top-0 p-4 bg-black backdrop-blur-lg text-xl uppercase font-mono tracking-wider animate-pulse">
          beeper coming soon. Still hacking...
        </p>
        <video
          className="w-full"
          src="/beeper_promo.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </main>
    </div>
  );
}

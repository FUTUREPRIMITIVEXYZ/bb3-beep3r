import Head from "next/head";

export default function Animation() {
  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-screen flex items-center justify-center overflow-hidden bg-black text-bpr-green relative">
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

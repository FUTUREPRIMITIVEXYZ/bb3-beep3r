import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Animation = () => {
  const dummyMessages = [
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
    "wealth is of the heart and mind, not the pocket",
  ];

  const [triggerEnter, setTriggerEnter] = useState(false);
  const [heroImage, setHeroImage] = useState("/beeper.webm");

  useEffect(() => {
    setTimeout(() => {
      setHeroImage("/beeper_square.png");
      setTriggerEnter(true);
    }, 7000);
  }, []);

  const variants = {
    init: { scale: 1, skewY: 0 },
    zoom: { scale: 1.6, skewY: 0 },
  };

  return (
    <div className="bg-black">
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full md:w-[1080px] md:h-[1080px] bg-black text-bpr-green relative font-mono">
        {triggerEnter ? (
          <motion.img
            animate={triggerEnter ? "zoom" : "init"}
            variants={variants}
            className="w-full fixed"
            src={heroImage}
          />
        ) : (
          <motion.video
            animate={triggerEnter ? "zoom" : "init"}
            variants={variants}
            className="w-full fixed"
            src={heroImage}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <motion.video
          animate={triggerEnter ? "zoom" : "init"}
          variants={variants}
          className="w-full fixed"
          src={heroImage}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute top-0 p-4 pt-32 pb-[75vh] space-y-6">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-md uppercase font-mono tracking-wider transform -translate-y-24 border-2 border-bpr-green crt bg-black card-overlay fixed animate-pulse z-10 cursor-pointer"
            >
              <a className="w-full" href="https://bb3.xyz">
                <p className="flex tems-center animate-pulse">
                  <span className="mr-4">💌</span> send a message on
                  beeper.bb3.xyz
                </p>
              </a>
            </motion.div>
            {triggerEnter ? (
              <>
                {dummyMessages.map((message: string, i: number) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={i}
                    className="w-full p-4 rounded-md uppercase font-mono tracking-wider  transform  border-2 border-bpr-green card-overlay relative crt z-10 space-y-2"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-lg crt z-0 backdrop-blur-sm"></div>
                    <div className="absolute -top-2 left-0 w-full h-full bg-blue-500/50 rounded-lg z-0 animate-pulse"></div>
                    <p className="text-lg relative z-10 border-b border-bpr-green/50">
                      FROM: [MIZUNA_AI]
                    </p>
                    <p className="text-sm relative z-10 ">{message}</p>
                  </motion.div>
                ))}
              </>
            ) : (
              <></>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Animation;

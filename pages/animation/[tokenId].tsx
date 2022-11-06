import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [publicMessages, setPublicMessages] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("/api/message");
      const data = await response.json();
      data.reverse();
      setPublicMessages(data);
      setLoadingMessages(false);
    }
    getUsers();
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
      <main className="w-full md:w-[1080px] md:h-[1080px] bg-black text-bpr-green relative">
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
              className="p-4 rounded-md uppercase tracking-wider transform -translate-y-24 border-2 border-bpr-green crt bg-black card-overlay fixed animate-pulse z-10 cursor-pointer"
            >
              <a
                className="w-full"
                href="https://beepers.bb3.xyz"
                target="_blank"
                rel="noreferrer"
              >
                <p className="flex tems-center animate-pulse">
                  <span className="mr-4">💌</span> send a message on
                  beeper.bb3.xyz
                </p>
              </a>
            </motion.div>
            {triggerEnter ? (
              <>
                <AnimatePresence>
                  {loadingMessages ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full p-4 rounded-md uppercase tracking-wider transform border border-bpr-green card-overlay relative crt z-10 animate-pulse"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md rounded-tl-none crt z-0 backdrop-blur-sm animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md rounded-tl-none z-0 animate-pulse"></div>
                      <p className="text-sm relative z-10 ">
                        loading messages...
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {publicMessages?.map((message: any, i: number) => (
                        <div key={i} className="space-y-1 mb-6">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-fit p-1 rounded-md rounded-bl-none uppercase tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
                          >
                            <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md rounded-bl-none crt z-0 backdrop-blur-sm"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md rounded-bl-none z-0"></div>
                            <div className="flex items-center space-x-4">
                              <div className="bg-orange-500 w-4 h-4 rounded-full animate-pulse"></div>
                              <p className="text-sm relative z-10">
                                {`${message.userFrom.wallet.slice(
                                  0,
                                  4
                                )}...${message.userFrom.wallet.slice(38)}`}
                              </p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={message.id}
                            className="w-full p-4 rounded-md rounded-tl-none uppercase tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
                          >
                            <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md rounded-tl-none crt z-0 backdrop-blur-sm"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md rounded-tl-none z-0"></div>
                            <p className="text-sm relative z-10 ">
                              {message.text}
                            </p>
                          </motion.div>
                          <Link href="https://beepers.bb3.xyz" target="_blank">
                            <p className="uppercase">send message ⮥</p>
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
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

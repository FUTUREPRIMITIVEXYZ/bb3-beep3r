/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";
import Announcements from "../components/announcements";
import Convos from "../components/convos";
import Menu from "../components/menu";
import SendMessage from "../components/sendMessage";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [modalSelection, setModalSelection] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");

  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-[500px] h-screen overflow-hidden bg-black text-bpr-green relative">
        <div className="fixed bottom-0 z-20 w-full max-w-[500px] flex flex-col items-center p-4 bg-gradient-to-t from-black">
          {modalSelection == 1 ? (
            <div
              onClick={() => setModalSelection(2)}
              className="w-fit h-12 bg-greydark mb-2 flex justify-center items-center"
            >
              <p className="w-full h-full bg-greylight/25 px-12 pt-2 text-2xl text-white font-mono uppercase cursor-pointer">
                new message
              </p>
            </div>
          ) : (
            <></>
          )}

          <div className="w-full">
            <Menu
              modalSelection={modalSelection}
              setModalSelection={setModalSelection}
            />
          </div>
        </div>
        {modalSelection == 0 ? (
          <></>
        ) : (
          <motion.div className="w-full h-full absolute top-0 z-10 backdrop-blur-lg overflow-scroll p-2 pb-48 space-y-4">
            <div className="w-full">
              <p
                onClick={() => setModalSelection(0)}
                className="bg-greydark text-white w-fit px-2 rounded-full cursor-pointer font-mono uppercase"
              >
                ← back
              </p>
            </div>
            {(() => {
              switch (modalSelection) {
                case 1:
                  return <Announcements />;
                case 2:
                  return (
                    <SendMessage
                      recipient={"all"}
                      setModalSelection={setModalSelection}
                    />
                  );
                case 3:
                  return <SendMessage recipient={"random"} />;
                case 4:
                  return <Convos />;
                default:
                  return null;
              }
            })()}
          </motion.div>
        )}

        <div className="absolute top-8 z-[9] w-full justify-between p-4 cursor-pointer font-thin tracking-wider font-sans text-white ml-16 text-sm">
          <a href="sms:+12058838339">
            <p className="w-1/2 ">
              This is a dynamic NFT made at ETHSF. Get your BEEPER by texting
              (205)-883-8339
            </p>
          </a>
          <div className="mt-4">
            <ConnectButton chainStatus="none" />
          </div>
        </div>
        <div className="w-full translate-y-16">
          <img className="w-full" src="/beeper_square.png" alt="" />
          <a
            href="https://opensea.io/collection/bb3-beep3r-ethsf-edition"
            className="text-white font-mono z-10 mx-16 bg-greylight/25 text-sm p-2 rounded-full"
          >
            view on Opensea ⛵️
          </a>
        </div>
      </main>
    </div>
  );
}

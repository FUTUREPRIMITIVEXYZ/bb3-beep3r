import { useEffect, useState } from "react";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useSigner } from "wagmi";
import Head from "next/head";

const Convo = () => {
  const [xmtpClient, setXmtpClient] = useState<Client>();
  const { data: signer, isError, isLoading } = useSigner();
  const [conversations, setConversations] = useState<Conversation[]>();
  const [conversationMessages, setConversationMessages] = useState<any>([]);

  const dummyMessages = [
    { content: "sub brah", wallet: "you" },
    { content: "hey there", wallet: "me" },
    { content: "aloha", wallet: "you" },
  ];

  useEffect(() => {
    async function setupXMTP() {
      try {
        if (signer) {
          const xmtp = await Client.create(signer);
          setXmtpClient(xmtp);
        }
      } catch (e) {
        /* handle error */
        console.error(e);
      }
    }

    setupXMTP();
  }, [signer]);

  useEffect(() => {
    async function fetchConvoByWallet() {
      if (xmtpClient) {
        if (xmtpClient) {
          const allConversations = await xmtpClient.conversations.list();
          console.log("conversations", allConversations);
          setConversations(allConversations);
          const messagesInConversation = await allConversations[0].messages();
          console.log(messagesInConversation[0].content);
          setConversationMessages(messagesInConversation);
        }
      }
    }
    fetchConvoByWallet();
  }, [xmtpClient]);

  return (
    <div>
      <Head>
        <title>BB3 Labs - Beep3r</title>
        <meta name="description" content="beepbeepbeep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-[500px] h-screen overflow-hidden bg-black text-bpr-green relative">
        <>
          {dummyMessages.map((convo: any, i: number) => (
            <div key={i} className="mb-12 justify-self-end">
              <div className="w-2/3 p-1 my-8 rounded-md rounded-bl-none uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md crt z-0 backdrop-blur-sm"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md z-0"></div>
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 w-4 h-4 rounded-full animate-pulse"></div>
                  <p className="text-sm relative z-10">{convo.content}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      </main>
    </div>
  );
};

export default Convo;

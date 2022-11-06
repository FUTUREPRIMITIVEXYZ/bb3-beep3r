import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useSigner } from "wagmi";

const Convos = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { data: signer, isError, isLoading } = useSigner();
  const [xmtpClient, setXmtpClient] = useState<Client>();
  const [conversations, setConversations] = useState<Conversation[]>();

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("/api/user");

      const data = await response.json();
      setAllUsers(data);
      //console.log({ data });
    }
  });

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
    async function fetchConvos() {
      if (xmtpClient) {
        const allConversations = await xmtpClient.conversations.list();
        console.log("conversations", allConversations);
        setConversations(allConversations);
      }
    }
    fetchConvos();
  }, [xmtpClient]);

  console.log(signer);

  return (
    <>
      {allUsers && allUsers.length > 0 ? (
        <>
          {allUsers?.map((user: any, i: number) => (
            <div key={i} className="mb-12">
              <Link href={"/convos/123"}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full p-1 my-8 rounded-md rounded-bl-none uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md crt z-0 backdrop-blur-sm"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md z-0"></div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500 w-4 h-4 rounded-full animate-pulse"></div>
                    <p className="text-sm relative z-10">{user.wallet}</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <>no convos, beep another user plz</>
      )}
    </>
  );
};

export default Convos;

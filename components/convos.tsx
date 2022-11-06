import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useSigner, useProvider } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Convos = () => {
  const [selectedConvo, setSelectedConvo] = useState<Conversation>();
  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider();
  const queryClient = useQueryClient();

  const convosQuery = useQuery({
    queryKey: ["convos"],
    queryFn: async () => {
      if (signer) {
        const xmtp = await Client.create(signer);
        const allConversations = await xmtp.conversations.list();

        return await Promise.all(
          allConversations.map(async (convo) => ({
            ...convo,
            ens: await provider.lookupAddress(convo.peerAddress),
            messages: await convo.messages({
              // Only show messages from last 24 hours
              startTime: new Date(
                new Date().setDate(new Date().getDate() - 10)
              ),
              endTime: new Date(),
            }),
          }))
        );
      } else {
        return [];
      }
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["convos"] });
  }, [signer]);

  console.log(convosQuery.data);

  return (
    <>
      {convosQuery.data && convosQuery.data.length > 0 ? (
        <>
          {convosQuery.data?.map((convo: any, i: number) => (
            <div key={i} className="mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-1 my-8 rounded-md rounded-bl-none uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md crt z-0 backdrop-blur-sm"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md z-0"></div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-orange-500 w-4 h-4 rounded-full animate-pulse"></div>
                  <p className="text-sm relative z-10">
                    {convo.ens ||
                      `${convo.peerAddress.slice(
                        0,
                        6
                      )}...${convo.peerAddress.slice(-4)}`}
                  </p>
                </div>
                {convo?.messages?.slice(0, 10).map((message: any) => (
                  <div className="flex items-center space-x-4 ml-4">
                    <p className="text-sm relative z-10">
                      {`${message.senderAddress.slice(
                        0,
                        5
                      )}...${message.senderAddress.slice(-3)}`}
                      : {message.content}
                    </p>
                  </div>
                ))}
                {convo?.messages?.length > 10 && (
                  <div className="flex items-center space-x-4 ml-4">
                    <p className="text-sm relative z-10">
                      + {convo?.messages?.length - 10} more
                    </p>
                  </div>
                )}
              </motion.div>
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

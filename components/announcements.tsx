import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const Announcements = ({ ...props }) => {
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
  }, []);
  return (
    <>
      <AnimatePresence>
        {loadingMessages ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full p-4 rounded-md uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10 animate-pulse"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md rounded-tl-none crt z-0 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md rounded-tl-none z-0 animate-pulse"></div>
            <p className="text-sm relative z-10 ">loading messages...</p>
          </motion.div>
        ) : (
          <>
            {publicMessages?.map((message: any, i: number) => (
              <div key={i} className="space-y-1 mb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-fit p-1 rounded-md rounded-bl-none uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
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
                  key={i}
                  className="w-full p-4 rounded-md rounded-tl-none uppercase font-mono tracking-wider transform border border-bpr-green card-overlay relative crt z-10"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-bpr-green/25 rounded-md rounded-tl-none crt z-0 backdrop-blur-sm"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 rounded-md rounded-tl-none z-0"></div>
                  <p className="text-sm relative z-10 ">{message.text}</p>
                </motion.div>
                <Link href={"/"}>
                  <p className="font-mono uppercase">send message ⮥</p>
                </Link>
              </div>
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Announcements;

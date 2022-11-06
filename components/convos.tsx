import { motion } from "framer-motion";
import Link from "next/link";

const Convos = () => {
  const dummyAddresses = [
    "druzy.eth",
    "ray.eth",
    "jw.eth",
    "alanah.eth",
    "greg.eth",
    "mizuna.eth",
  ];
  return (
    <>
      {dummyAddresses.map((address: any, i: number) => (
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
                <p className="text-sm relative z-10">{address}</p>
              </div>
            </motion.div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Convos;

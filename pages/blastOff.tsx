import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const whiteListedWallets = (process.env.BOSS_WALLETS || "").split(",");

  return {
    props: {
      authorizedList: whiteListedWallets,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

function BlastOff({ authorizedList }: AuthenticatedPageProps) {
  const [message, setMessage] = useState("");
  const { address } = useAccount();

  const handleSubmission = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log({ message });
      const response = await fetch("api/blastOff", {
        method: "POST",
        body: JSON.stringify({
          message,
          wallet: address,
        }),
      });

      const data = await response.json();

      if (data) {
        alert("message sent");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
    e.preventDefault();
  };

  return (
    <div className="relative bg-black text-green-500 h-[100vh]">
      <ConnectButton chainStatus="none" />
      {address && authorizedList.some((w: string) => w === address) && (
        <form
          className="absolute top-[50%] translate-x-[0] translate-y-[50%] m-0 flex justify-center items-center w-[100%]"
          onSubmit={(e) => handleSubmission(e)}
        >
          <input
            className="bg-transparent border-2 border-solid border-green-500 py-2 px-4 mr-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="border-2 border-solid border-green-500 py-2 px-4">
            send message
          </button>
        </form>
      )}
    </div>
  );
}

export default BlastOff;

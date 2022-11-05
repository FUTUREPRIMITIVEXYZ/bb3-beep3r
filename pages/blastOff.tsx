import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.

  // You can then pass any data you want
  // to the page component here.

  const whiteListedWallets = (process.env.BOSS_WALLETS || "").split(",");

  const isAllowList = whiteListedWallets.some((w) => {
    if (session?.user?.name) {
      return w.toLowerCase() === session?.user?.name.toLowerCase();
    }

    return false;
  });

  return {
    props: {
      address,
      session,
      authorized: isAllowList,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

function BlastOff({ address, authorized }: AuthenticatedPageProps) {
  const [message, setMessage] = useState("");

  const handleSubmission = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log({ message });
      const response = await fetch("api/blastOff", {
        method: "POST",
        body: message,
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
    <div className="relative bg-black text-green-500">
      <ConnectButton />
      {address && authorized && (
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

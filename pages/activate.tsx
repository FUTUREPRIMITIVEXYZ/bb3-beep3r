import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.

  // You can then pass any data you want
  // to the page component here.
  return {
    props: {
      address,
      session,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const Activate = ({ address, setMessage }: AuthenticatedPageProps) => {
  const router = useRouter();
  const code = router.query["code"];
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (!code) {
      router.push("/");
    }

    setMessage(`Sign into beeper: ${code}`);
  }, [code]);

  useEffect(() => {
    console.log("opening...", openConnectModal);
    openConnectModal && openConnectModal();
  }, [openConnectModal, address]);

  useEffect(() => {
    async function monitorAccount() {
      const session = await getSession();

      if (session?.user?.name) {
        router.push("/");
      }
    }

    monitorAccount();
  });

  return <>{address ? <div>{address}</div> : <ConnectButton />}</>;
};

export default Activate;

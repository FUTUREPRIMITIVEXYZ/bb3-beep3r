import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to beeper",
});

export default function App({ Component, pageProps }: AppProps) {
  const [message, setMessage] = useState("Sign into beeper");

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: message,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            <Component
              {...pageProps}
              message={message}
              setMessage={setMessage}
            />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

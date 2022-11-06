import { useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useState } from "react";

const ALCHEMY_PROVIDER = alchemyProvider({ apiKey: process.env.ALCHEMY_ID });
const PUBLIC_PROVIDER = publicProvider();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [message, setMessage] = useState("Sign into beeper");
  const [chains, setChains] = useState<any>({});
  const [provider, setProvider] = useState<any>({});
  const [connectors, setConnectors] = useState<any>({});
  const [wagmiClient, setWagmiClient] = useState<any>({});
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (router.pathname.split("/")[1] !== "animation") {
      const { chains, provider } = configureChains(
        [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
        [ALCHEMY_PROVIDER, PUBLIC_PROVIDER]
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

      setChains(chains);
      setProvider(provider);
      setConnectors(connectors);
      setWagmiClient(wagmiClient);
      setInitialized(true);
    }
  }, [router.pathname.split("/")[1]]);

  if (router.pathname.split("/")[1] == "animation") {
    return (
      <Component {...pageProps} message={message} setMessage={setMessage} />
    );
  }

  if (!initialized) {
    return <div>loading...</div>;
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={midnightTheme({
          accentColor: "#94C53D",
          accentColorForeground: "white",
          borderRadius: "none",
        })}
      >
        <Component {...pageProps} message={message} setMessage={setMessage} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [message, setMessage] = useState("Sign into beeper");

  return <Component {...pageProps} message={message} setMessage={setMessage} />;
}

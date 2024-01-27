import type { AppProps } from "next/app";
import "../styles/globals.css";
import "flowbite";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Layout from "../Layout/index";
import {
  bscTestnet,
  baseGoerli,
  avalancheFuji,
  polygonMumbai,
  optimismGoerli,
  sepolia,
} from "wagmi/chains";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    bscTestnet,
    baseGoerli,
    avalancheFuji,
    polygonMumbai,
    optimismGoerli,
    sepolia,
  ],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <WagmiConfig config={config}>
          <Component {...pageProps} />
        </WagmiConfig>
      </Layout>
    </Provider>
  );
}

import { Inter } from "next/font/google";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import { selectActiveChain } from "@/redux/features/activeChain";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/nav/navbar";
import FooterBody from "@/components/footer/Footer";
import Head from "next/head";
import { Sepolia } from "@thirdweb-dev/chains";
export default function Layout({ children }: { children: React.ReactNode }) {
  const currentChain = useSelector(selectActiveChain);

  return (
    <ThirdwebProvider
      activeChain={Sepolia || currentChain}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        safeWallet({
          recommended: true,
          personalWallets: [
            metamaskWallet(),
            coinbaseWallet({ recommended: true }),
            walletConnect(),
            localWallet(),
            trustWallet({ recommended: true }),
          ],
        }),
        localWallet(),

        trustWallet({ recommended: true }),
      ]}
    >
      <Head>
        <title>WeaveSwap - Unlock Seamless Cross-Chain Swaps</title>

        <meta
          name="description"
          content="Experience secure and seamless cross-chain swaps with WeaveSwap. Unlock the future of decentralized asset transactions."
        />
        <meta
          name="keywords"
          content="WeaveSwap, cross-chain swaps, decentralized assets, blockchain, digital asset exchange"
        />
        <meta name="author" content="Your Name or Your Company Name" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* Add more meta tags as needed */}
      </Head>{" "}
      <Navbar />
      {children}
      <FooterBody />
      <ToastContainer />
    </ThirdwebProvider>
  );
}

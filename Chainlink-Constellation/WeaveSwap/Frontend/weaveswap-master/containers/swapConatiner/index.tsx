import React from "react";
import styles from "./index.module.css";

import SingleCrossSwapInput from "@/components/inputs/singleCrossPayment/singleCrossSwapInput";
import ConnectWalletPage from "@/components/connectWalletPage";
import { useAddress } from "@thirdweb-dev/react";
import FirstNetworkModal from "@/components/modal/firstNetworkModalPage";
import SecondNetworkModal from "@/components/modal/secondNetworkModal";

import CoinPrice from "@/components/coinPrice/Coinprice";
export default function SwapContainer() {
  const address = useAddress();
  if (!address)
    return (
      <div>
        <ConnectWalletPage />
      </div>
    );

  return (
    <div className={styles.SwapContainer}>
      {/* <h1 className={styles.crossChain_Header}>Cross Chain Swap</h1> */}

      <div className={styles.coinDetailsTag}>
        <CoinPrice />
      </div>
      <div className={styles.crossChainSection}>
        <section className={`${styles.crossChain_Header}`}>
          {/* <h4></h4> */}
        </section>
        <div>
          <section>
            <div className={styles.SwapDropDown}>
              <FirstNetworkModal />
              <h5>to</h5>
              <SecondNetworkModal />
            </div>
            <hr />
            <div>
              <SingleCrossSwapInput />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

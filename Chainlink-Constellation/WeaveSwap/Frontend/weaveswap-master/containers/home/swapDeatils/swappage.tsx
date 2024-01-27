import React from "react";
import Image from "next/image";
import OraclePng from "../../../assets/png/blockchainstorage.png";
import CrossChainPng from "../../../assets/png/block1.png";
import SecurePng from "../../../assets/png/secure1.png";
import styles from "./index.module.css";
export default function Swappage() {
  return (
    <div className={`${styles.Swappage} container mx-auto `}>
      <section className={styles.SwapLiqudity}>
        <div className={styles.swapText}>
          <h1> Chainlink Oracle Verification </h1>
          <p>
            Trust in transparency. We utilize Chainlink Oracle to verify the
            security of locked assets on the source chain and ensure the
            readiness of the target chain to release assets, providing real-time
            feedback for your peace of mind.
          </p>
        </div>

        <div className={styles.swapImg}>
          <Image src={OraclePng} alt="Liquidity" width={700} height={500} />
        </div>
      </section>
      <section className={`${styles.SwapLiqudity} ${styles.SwapFlex}`}>
        <div className={styles.swapImg}>
          <Image src={CrossChainPng} alt="Liquidity" width={700} height={500} />
        </div>
        <div className={styles.swapText}>
          <h1>Cross-Chain Functionality</h1>
          <p>
            Execute transactions effortlessly across various chains using the
            Chainlink Cross-Chain Interoperability Protocol (CCIP). This robust
            feature guarantees reliability and security in every swap.
          </p>
          <button className={styles.swapBtn}>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Swap</span>
          </button>{" "}
        </div>
      </section>{" "}
      <section className={styles.SwapLiqudity}>
        <div className={styles.swapText}>
          <h1> Secure Smart Contracts</h1>
          <p>
            Our source chain contracts implement robust asset locking, ensuring
            the safety of your digital assets. The target chain contracts
            monitor, verify, and release assets with precision.
          </p>
          <button className={styles.swapBtn}>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Learn More</span>
          </button>{" "}
        </div>

        <div className={styles.swapImg}>
          <Image src={SecurePng} alt="Liquidity" width={700} height={500} />
        </div>
      </section>
      {/*  security
       */}
    </div>
  );
}

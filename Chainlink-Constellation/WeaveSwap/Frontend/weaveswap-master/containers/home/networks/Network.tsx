import React from "react";
import styles from "./network.module.css";
import MarqueePage from "@/components/marque/Marquee";
export default function Network() {
  return (
    <div>
      <section className={`${styles.countUp}`}>
        <div>
          <h4>6x </h4>
          <p> Chains Supported</p>
        </div>{" "}
        <div>
          <h4>100% </h4>
          <p> Secure & Safe</p>
        </div>{" "}
        <div>
          <h4>100x </h4>
          <p> Fast Transaction</p>
        </div>{" "}
        <div>
          <h4>24/7 </h4>
          <p> Active Transactions</p>
        </div>
      </section>

      <section className={styles.networkSection}>
        <h1>Cross-Chain Compatibility </h1>
        <p>
          Unlock the potential of diverse blockchain networks. WeaveSwap enables
          you to effortlessly conduct transactions across different chains,
          expanding your possibilities.
        </p>
        <MarqueePage />
      </section>
    </div>
  );
}

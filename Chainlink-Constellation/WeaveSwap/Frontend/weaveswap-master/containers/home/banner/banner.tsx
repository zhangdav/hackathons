import React from "react";
import styles from "./banner.module.css";
import Link from "next/link";
export default function Banner() {
  return (
    <div className={styles.Banner}>
      <button className={styles.welcome_Banner}>Welcome to WeaveSwap</button>
      <h1>
        Your One-shop access to{" "}
        <span className={styles.decentralized}>
          decentralized Asset Swapping
        </span>{" "}
      </h1>
      <p>
        Welcome to WeaveSwap, where blockchain meets simplicity. Seamlessly
        exchange assets across different chains with confidence and ease.
      </p>
      <div className={styles.btn_div}>
        <Link href="/swap">
          <button className={styles.LaunchBtb}></button>
        </Link>
      </div>
    </div>
  );
}

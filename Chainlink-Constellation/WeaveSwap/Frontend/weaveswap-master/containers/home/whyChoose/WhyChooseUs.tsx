import React from "react";
import Image from "next/image";
import SecurityPng from "../../../assets/png/blockchain.png";
import CloudPng from "../../../assets/png/blockchain cloud.png";
import styles from "./whyChoose.module.css";
export default function WhyChooseUs() {
  return (
    <div className={`${styles.WhyChooseUs} container mx-auto`}>
      <h1 className={styles.Empowered}>Empowered by the community</h1>
      <section className={styles.WhyChooseUs_section}>
        <div className={styles.WhyChooseUs_div}>
          <div>
            <h1>Security First</h1>
            <p>
              Our smart contracts prioritize the security of your digital
              assets, implementing state-of-the-art measures to safeguard your
              transactions.
            </p>
          </div>
          <Image src={SecurityPng} alt="" width={500} height={500} />
        </div>{" "}
        <div className={styles.WhyChooseUs_div}>
          <div>
            <h1>Security First</h1>
            <p>
              Our smart contracts prioritize the security of your digital
              assets, implementing state-of-the-art measures to safeguard your
              transactions.
            </p>
          </div>
          <Image src={CloudPng} alt="" width={800} height={500} />
        </div>
      </section>
    </div>
  );
}

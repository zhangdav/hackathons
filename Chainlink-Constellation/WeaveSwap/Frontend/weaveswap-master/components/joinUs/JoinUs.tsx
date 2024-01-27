import React from "react";
import styles from "./joinUs.module.css";
import LinkedinLogo from "../../assets/png/linkedin.png";
import TwitterLogog from "../../assets/png/twitterGreen.png";
import DiscordLogo from "../../assets/png/discordGreen.png";
import Image from "next/image";
export default function JoinUs() {
  return (
    <div className={styles.JoinUs}>
      <h1>Join us</h1>
      <section>
        <div>
          <Image
            src={LinkedinLogo}
            alt="linkedin logo"
            width={200}
            height={200}
          />
          <p>linkdien</p>
        </div>{" "}
        <div>
          <Image
            src={TwitterLogog}
            alt="linkedin logo"
            width={200}
            height={200}
          />
          <p>twiiter</p>
        </div>{" "}
        <div>
          <Image
            src={DiscordLogo}
            alt="linkedin logo"
            width={200}
            height={200}
          />
          <p>discord</p>
        </div>
      </section>
    </div>
  );
}

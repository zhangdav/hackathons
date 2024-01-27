import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import MumbaiLogo from "../../assets/png/polygon.png";
import SepoliaLogo from "../../assets/png/ethlogo.png";
import BaseLogo from "../../assets/png/base.png";
import AvaLogo from "../../assets/png/avalanche.png";
import OpLogo from "../../assets/png/OP-Token.png";
import BinanceLogo from "../../assets/png/Binance_Logo.png";
import styles from "./marquee.module.css";
const logos = [
  { name: "Mumbai", logo: MumbaiLogo },
  { name: "Sepolia", logo: SepoliaLogo },
  { name: "Base", logo: BaseLogo },
  { name: "Ava", logo: AvaLogo },
  { name: "Op", logo: OpLogo },
  { name: "Binance", logo: BinanceLogo },
];
const MarqueePage = () => {
  return (
    <div>
      <Marquee speed={16} pauseOnHover={false} gradient={false}>
        <div className={styles.widget_scroll}>
          {logos.map((item, i) => (
            <div className={styles.itemsBody} key={i}>
              <Image
                src={item.logo}
                alt={`${item.name} Logo`}
                width={50}
                height={50}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueePage;

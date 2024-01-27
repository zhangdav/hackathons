import React from "react";
import Banner from "./banner/banner";
import Network from "./networks/Network";
import Swappage from "./swapDeatils/swappage";
import JoinUs from "@/components/joinUs/JoinUs";
import WhyChooseUs from "./whyChoose/WhyChooseUs";
export default function Home() {
  return (
    <div>
      <Banner />
      <Network />
      <Swappage />
      <WhyChooseUs /> <JoinUs />
    </div>
  );
}

import React, { useState } from "react";
import { useSwitchChain, useChain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";

export default function SecondNetworkDropdown() {
  const switchChain = useSwitchChain();
  const chain = useChain();

  const [selectedChain, setSelectedChain] = useState();

  return (
    <div>
      <Dropdown
        label={chain?.name ? chain?.name : `Connect Wallet`}
        dismissOnClick={false}
      >
        <Dropdown.Item
          value="Sepolia"
          onClick={() => switchChain(Sepolia.chainId)}
        >
          Sepolia
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="Mumbai"
          onClick={() => switchChain(Mumbai.chainId)}
        >
          Mumbai
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="AvalancheFuji"
          onClick={() => switchChain(AvalancheFuji.chainId)}
        >
          AvalancheFuji
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="BaseGoerli"
          onClick={() => switchChain(BaseGoerli.chainId)}
        >
          OptimismGoerli
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="OptimismGoerli"
          onClick={() => switchChain(OptimismGoerli.chainId)}
        >
          OptimismGoerli
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="BinanceTestnet"
          onClick={() => switchChain(BinanceTestnet.chainId)}
        >
          BinanceTestnet
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}

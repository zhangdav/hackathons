import React, { useState } from "react";
import { useChain, Chain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";

export default function TokensDropdown() {
  // Custom hook to get information about the current blockchain network
  const chain = useChain();

  // State to keep track of the selected chain
  const [selectedChain, setSelectedChain] = useState<string | undefined>(
    undefined
  );

  // Handler for the selection change in the dropdown
  const handleSelectChange = (value: string) => {
    // Update the selectedChain state with the chosen value
    setSelectedChain(value);
  };

  return (
    <div>
      {/* Dropdown component for selecting different blockchain networks */}
      <Dropdown
        label={selectedChain ? String(selectedChain) : `Connect Wallet`}
        dismissOnClick={false}
      >
        {/* Individual items in the dropdown for each blockchain network */}
        <Dropdown.Item
          value="Sepolia"
          onClick={() => handleSelectChange(Sepolia.name)}
        >
          Link
        </Dropdown.Item>
        <Dropdown.Item
          value="Mumbai"
          onClick={() => handleSelectChange(Mumbai.name)}
        >
          Mumbai
        </Dropdown.Item>
        <Dropdown.Item
          value="AvalancheFuji"
          onClick={() => handleSelectChange(AvalancheFuji.name)}
        >
          AvalancheFuji
        </Dropdown.Item>
        <Dropdown.Item
          value="BaseGoerli"
          onClick={() => handleSelectChange(BaseGoerli.name)}
        >
          OptimismGoerli
        </Dropdown.Item>
        <Dropdown.Item
          value="OptimismGoerli"
          onClick={() => handleSelectChange(OptimismGoerli.name)}
        >
          OptimismGoerli
        </Dropdown.Item>
        <Dropdown.Item
          value="BinanceTestnet"
          onClick={() => handleSelectChange(BinanceTestnet.name)}
        >
          BinanceTestnet
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}

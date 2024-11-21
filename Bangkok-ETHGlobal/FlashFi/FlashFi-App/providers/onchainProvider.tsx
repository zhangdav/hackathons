'use client'

import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DynamicContextProvider,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { WagmiProvider } from 'wagmi'
import { config } from "../lib/wagmi";
import { mantleSepoliaTestnet, rootstockTestnet, celoAlfajores, baseSepolia, arbitrumSepolia, scrollSepolia, lineaSepolia } from 'viem/chains'
import type { Chain } from "viem";

// const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API ?? undefined
const dynamicEnvId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID;
const queryClient = new QueryClient()


export default function OnchainProvider({ children }: { children: ReactNode }) {

  const viemChainToCustomNetwork = (viemChain: Chain, iconUrl?: string) => {
    return {
      blockExplorerUrls: viemChain.blockExplorers?.default?.url
        ? [viemChain.blockExplorers.default.url]
        : [],
      chainId: viemChain.id,
      chainName: viemChain.name,
      iconUrls: iconUrl ? [iconUrl] : [],
      name: viemChain.name,
      nativeCurrency: {
        decimals: viemChain.nativeCurrency.decimals,
        name: viemChain.nativeCurrency.name,
        symbol: viemChain.nativeCurrency.symbol,
      },
      networkId: viemChain.id,
      rpcUrls: viemChain.rpcUrls?.default?.http
        ? [...viemChain.rpcUrls.default.http]
        : [],
    };
  };

  const evmNetworks = [
    viemChainToCustomNetwork(rootstockTestnet, '/assets/rootstock.png'),
    viemChainToCustomNetwork(mantleSepoliaTestnet, '/assets/mantle.png'),
    viemChainToCustomNetwork(celoAlfajores, '/assets/celo.png'),
    viemChainToCustomNetwork(baseSepolia, '/assets/base.png'),
    viemChainToCustomNetwork(arbitrumSepolia, '/assets/arbitrum.png'),
    viemChainToCustomNetwork(scrollSepolia, '/assets/scroll.png'),
    // viemChainToCustomNetwork(lineaSepolia, '/assets/linea.png'),
  ];

  if (!dynamicEnvId) {
    const errMsg =
      "Please add your Dynamic Environment to this project's .env file";
    console.error(errMsg);
    throw new Error(errMsg);
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvId,
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
  }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}

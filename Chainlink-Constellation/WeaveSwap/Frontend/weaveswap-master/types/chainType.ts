export interface ChainExplorer {
  name: string;
  url: string;
  standard: string;
  icon: {
    format: string;
    height: number;
    url: string;
    width: number;
  };
}

export interface ChainType {
  chain: string;
  chainId: number;
  explorers?: any;
  faucets?: any;
  features?: any;
  icon?: {
    format: string;
    height: number;
    url: string;
    width: number;
  };
  infoURL?: string;
  name?: string;
  nativeCurrency?: {
    decimals: number;
    name: string;
    symbol: string;
  };
  networkId?: number;
  redFlags?: any;
  rpc?: any;
  shortName?: string;
  slug?: string;
  testnet?: boolean;
}

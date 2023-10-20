import "./index.css";

import type { Connection, PublicKey } from "@solana/web3.js";
import type {
  WalletName,
  SignerWalletAdapterProps,
} from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";
import type { CSSProperties } from "react";

export interface WalletPassThroughProps {
  publicKey: PublicKey | null | undefined;
  wallets: Wallet[];
  wallet: Wallet | null;
  connect: () => Promise<void>;
  select: (walletName: WalletName) => void;
  connecting: boolean;
  connected: boolean;
  disconnect: () => Promise<void>;
  signAllTransactions:
    | SignerWalletAdapterProps["signAllTransactions"]
    | undefined;

  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export type WidgetProps = (EndpointOnly | ConnectionOnly) & CommonProps;

interface EndpointOnly {
  endpoint: string;
  connection?: never;
}

interface ConnectionOnly {
  endpoint?: never;
  connection: Connection;
}

interface CommonProps {
  passthroughWallet?: WalletPassThroughProps;
  containerClassNames?: string;
  containerStyles?: CSSProperties;
  rootWrapperClassNames?: string;
  rootWrapperStyles?: CSSProperties;
}

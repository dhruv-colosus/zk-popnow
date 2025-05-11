import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { RPC_ENDPOINT } from "../util/conn";

export const useUmi = () => {
  const wallet = useWallet();
  const umi = createUmi(RPC_ENDPOINT);
  umi.use(walletAdapterIdentity(wallet));
  return umi;
};

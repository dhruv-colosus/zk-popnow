import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "../util/conn";

export const useMetaplex = () => {
  const wallet = useWallet();
  return Metaplex.make(connection).use(walletAdapterIdentity(wallet));
};

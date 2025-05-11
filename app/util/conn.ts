import { Rpc, createRpc } from "@lightprotocol/stateless.js";

export const RPC_ENDPOINT = "https://api.devnet.solana.com";
const PHOTON_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = RPC_ENDPOINT;
export const connection: Rpc = createRpc(
  RPC_ENDPOINT,
  PHOTON_ENDPOINT,
  PROVER_ENDPOINT
);

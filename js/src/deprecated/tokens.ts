import { PublicKey, Connection } from "@solana/web3.js";
import { getHashedName, getNameAccountKey } from "./utils";
import { NameRegistryState, TokenData, Mint } from "../state";
import { SNSError, ErrorType } from "../error";

/**
 * @deprecated
 */
export const TOKEN_TLD = new PublicKey(
  "6NSu2tci4apRKQtt257bAVcvqYjB3zV2H1dWo56vgpa6"
);

/**
 * @deprecated
 */
export const getTokenInfoFromMint = async (
  connection: Connection,
  mint: PublicKey
) => {
  const nameKey = await getNameAccountKey(
    await getHashedName(mint.toBase58()),
    undefined,
    TOKEN_TLD
  );
  const { registry } = await NameRegistryState.retrieve(connection, nameKey);
  if (!registry.data) {
    throw new SNSError(ErrorType.NoAccountData);
  }
  return TokenData.deserialize(registry.data);
};

/**
 * @deprecated
 */
export const getTokenInfoFromName = async (
  connection: Connection,
  name: string
) => {
  const reverseNameKey = await getNameAccountKey(
    await getHashedName(name),
    undefined,
    TOKEN_TLD
  );
  const { registry: reverseRegistry } = await NameRegistryState.retrieve(
    connection,
    reverseNameKey
  );
  if (!reverseRegistry.data) {
    throw new SNSError(ErrorType.NoAccountData);
  }
  const mint = new PublicKey(Mint.deserialize(reverseRegistry.data).mint);
  return await getTokenInfoFromMint(connection, mint);
};

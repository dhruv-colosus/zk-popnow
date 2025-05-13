"use server";

import prisma from "@/prisma/db";
import { AwsClient } from "aws4fetch";
import { v2 as cloudinary } from "cloudinary";
import { connection } from "./conn";
import {
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  CompressedTokenProgram,
  getTokenPoolInfos,
  selectTokenPoolInfo,
} from "@lightprotocol/compressed-token";
import { selectStateTreeInfo } from "@lightprotocol/stateless.js";
import bs58 from "bs58";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  arrayBuffer: ArrayBuffer,
  type: string
) {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${type};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "popnow",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    throw new Error("Failed to upload image");
  }
}

type Event = {
  name: string;
  totalSupply: number;
  imageUrl: string;
  mintAddress: string;
};

export async function createEvent(event: Event) {
  let slug = event.name.toLowerCase().replace(/ /g, "-");

  const existingEvent = await prisma.event.findFirst({ where: { slug } });

  if (existingEvent) {
    const uuid = Math.random().toString(36).substring(2, 10);
    slug = `${uuid}-${slug}`;
  }

  await prisma.event.create({
    data: {
      name: event.name,
      slug,
      mintAddress: event.mintAddress,
      imageUrl: event.imageUrl,
      totalSupply: event.totalSupply,
      currentSupply: event.totalSupply,
    },
  });

  return slug;
}

export async function getEvent(slug: string) {
  return await prisma.event.findFirst({ where: { slug } });
}

export async function claimAirdrop(slug: string, userAddress: string) {
  const event = await prisma.event.findFirst({
    where: { slug },
  });

  if (!event || event.currentSupply <= 0) {
    throw new Error("Event not found or no supply left");
  }

  const userPublicKey = new PublicKey(userAddress);

  const tx = new Transaction();

  const sourceTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(event.mintAddress),
    new PublicKey(process.env.NEXT_PUBLIC_ESCROW_ADDRESS as string),
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const activeStateTrees = await connection.getStateTreeInfos();
  const treeInfo = selectStateTreeInfo(activeStateTrees);
  const infos = await getTokenPoolInfos(
    connection,
    new PublicKey(event.mintAddress)
  );
  const info = selectTokenPoolInfo(infos);
  const compressInstruction = await CompressedTokenProgram.compress({
    payer: userPublicKey,
    owner: new PublicKey(process.env.NEXT_PUBLIC_ESCROW_ADDRESS as string),
    source: sourceTokenAccount,
    toAddress: userPublicKey,
    amount: 1,
    mint: new PublicKey(event.mintAddress),
    tokenPoolInfo: info,
    outputStateTreeInfo: treeInfo,
  });

  tx.add(compressInstruction);

  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = userPublicKey;
  // tx.partialSign(Keypair.fromSecretKey(bs58.decode(process.env.ESCROW_KEY!)));

  return tx.serialize({ requireAllSignatures: false });
}

export const incrementAirdropSupply = async (slug: string) => {
  const event = await prisma.event.findFirst({
    where: { slug },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  await prisma.event.update({
    where: { id: event.id },
    data: { currentSupply: { decrement: 1 } },
  });
};

export async function getAllEvents() {
  return await prisma.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

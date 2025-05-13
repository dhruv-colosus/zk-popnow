"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, m } from "framer-motion";
import { Upload, XCircle, Loader2 } from "lucide-react";
import { connection } from "../util/conn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUmi } from "../hooks/use-umi";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  MINT_SIZE,
  createMintToInstruction,
  createInitializeMetadataPointerInstruction,
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SendTransactionError,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { CompressedTokenProgram } from "@lightprotocol/compressed-token";
import {
  createFungible,
  createMetadataAccountV3,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import { useRouter } from "next/navigation";
import { createEvent, uploadToCloudinary } from "../util/actions";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  fromWeb3JsTransaction,
  toWeb3JsInstruction,
  toWeb3JsPublicKey,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import {
  createInitializeInstruction as createSplTokenMetadataInitializeInstruction,
  pack as packTokenMetadata,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { metadata } from "../layout";

export default function CreatePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [decimal, setDecimal] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const isFormValid =
    eventName.trim() !== "" &&
    totalSupply.trim() !== "" &&
    selectedImage !== null;

  const wallet = useWallet();
  const umi = useUmi();
  const router = useRouter();

  const handleMintTokens = async () => {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signMessage ||
      !wallet.signAllTransactions
    ) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isFormValid) {
      if (!eventName.trim()) {
        toast.error("Please enter an event name");
      } else if (!totalSupply.trim()) {
        toast.error("Please enter a total supply");
      } else if (!selectedImage) {
        toast.error("Please select an image");
      }
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        eventName,
        totalSupply,
        decimal,
        selectedImage,
      };
      console.log(JSON.stringify(data));

      const { url, publicId } = await uploadToCloudinary(
        await fetch(selectedImage).then((res) => res.arrayBuffer()),
        "image/png"
      );

      console.log(url, publicId);

      console.log("Uploaded image");

      const transaction = new Transaction();

      const tokenMint = Keypair.generate();
      const escrowPubkey = new PublicKey(
        process.env.NEXT_PUBLIC_ESCROW_ADDRESS as string
      );

      const metadata: TokenMetadata = {
        mint: tokenMint.publicKey,
        name: eventName,
        symbol: eventName,
        uri: `${window.location.origin}/api/tokens/${publicId}`,
        additionalMetadata: [],
      };
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen =
        TYPE_SIZE + LENGTH_SIZE + packTokenMetadata(metadata).length;

      const [createMintAccountIx, initializeMintIx, createTokenPoolIx] =
        await CompressedTokenProgram.createMint({
          feePayer: wallet.publicKey,
          authority: wallet.publicKey,
          mint: tokenMint.publicKey,
          decimals: 0,
          freezeAuthority: null,
          rentExemptBalance: await connection.getMinimumBalanceForRentExemption(
            mintLen + metadataLen
          ),
          mintSize: mintLen,
          tokenProgramId: TOKEN_2022_PROGRAM_ID,
        });

      const ataAddress = getAssociatedTokenAddressSync(
        tokenMint.publicKey,
        escrowPubkey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      console.log("ata", ataAddress, ataAddress.toBase58());
      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        ataAddress,
        escrowPubkey,
        tokenMint.publicKey,
        TOKEN_2022_PROGRAM_ID
      );

      const instructions = [
        createMintAccountIx,
        createInitializeMetadataPointerInstruction(
          tokenMint.publicKey,
          wallet.publicKey,
          tokenMint.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        initializeMintIx,
        createSplTokenMetadataInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID, // Token program hosting metadata
          mint: tokenMint.publicKey,
          metadata: tokenMint.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        }),
        createTokenPoolIx,
        createAtaIx,
      ];

      const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions,
      }).compileToV0Message();

      const signedTransaction = await wallet.signTransaction(
        new VersionedTransaction(messageV0)
      );
      signedTransaction.sign([tokenMint]);

      console.log(signedTransaction.message.serialize().toString("base64"));

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      console.log(
        `create-mint success! txId: ${signature}, mint: ${tokenMint.publicKey.toBase58()}`
      );

      toast.loading(
        `Transaction sent successfully, waiting for confirmation...`
      );

      await connection.confirmTransaction({
        signature,
        ...(await connection.getLatestBlockhash()),
      });

      toast.success(
        `Token mint created at ${tokenMint.publicKey.toBase58()}\nSignature: ${signature}`
      );

      const mintToInstruction = createMintToInstruction(
        tokenMint.publicKey,
        ataAddress,
        wallet.publicKey,
        Number(totalSupply),
        [],
        TOKEN_2022_PROGRAM_ID
      );

      const mintTx = new Transaction();
      mintTx.add(mintToInstruction);
      mintTx.feePayer = wallet.publicKey;
      mintTx.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const signedMintTx = await wallet.signTransaction(
        new VersionedTransaction(mintTx.compileMessage())
      );

      console.log(signedMintTx.message.serialize().toString("base64"));

      const mintSignature = await connection.sendRawTransaction(
        signedMintTx.serialize()
      );

      toast.loading(`Minting tokens...`);

      await connection.confirmTransaction({
        signature: mintSignature,
        ...(await connection.getLatestBlockhash()),
      });

      toast.success(`Tokens minted successfully\nSignature: ${mintSignature}`);

      const slug = await createEvent({
        name: eventName,
        totalSupply: parseInt(totalSupply),
        imageUrl: url,
        mintAddress: tokenMint.publicKey.toBase58(),
      });

      router.push(`/event/${slug}`);
    } catch (e) {
      console.log(e);
      if (e instanceof SendTransactionError) {
        console.log(await e.getLogs(connection));
      }
      toast.error("Failed to create token mint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-black font-helvetica">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/image/bg-2.png"
          alt="background"
          fill
          className="object-cover"
        />
      </div>

      <motion.div
        className="flex flex-col items-center justify-center z-10 mt-20 md:mt-10 px-4 md:px-0 mb-16 font-helvetica w-full max-w-[95%] md:max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-center text-[2.5rem] md:text-[4rem] leading-[2.8rem] md:leading-[4.2rem] tracking-tight drop-shadow-lg mb-6 md:mb-10 font-helvetica"
          variants={itemVariants}
        >
          <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
            Create your cToken
          </span>
        </motion.h1>

        <motion.div
          className="bg-[#ffffff]/3 backdrop-blur-md rounded-[30px] md:rounded-[60px] p-5 md:p-8 border border-[#727272]/20 shadow-lg w-full font-helvetica"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className="bg-gradient-to-r from-[#f6f7ff] to-[#959edc]/70 bg-clip-text font-helvetica text-lg md:text-xl font-regular mb-6 md:mb-8 text-transparent">
              Create Your Event & Mint Participation Tokens
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-32 font-helvetica">
            <div className="flex flex-col gap-5 md:gap-6 font-helvetica">
              <motion.div
                className="flex flex-col gap-2 font-helvetica"
                variants={itemVariants}
              >
                <label className="text-sm text-white/70 font-helvetica">
                  Event name
                </label>
                <input
                  type="text"
                  placeholder="event name ...."
                  className="px-4 py-2 text-white border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </motion.div>

              <motion.div
                className="flex flex-col gap-2 font-helvetica"
                variants={itemVariants}
              >
                <label className="text-sm text-white/70 font-helvetica">
                  Total supply
                </label>
                <div className="relative font-helvetica">
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full px-4 py-2 text-white border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                  />
                  <span className="absolute text-sm transform -translate-y-1/2 right-4 top-1/2 text-white/50 font-helvetica">
                    tokens
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col gap-2 font-helvetica"
                variants={itemVariants}
              >
                <label className="text-sm text-white/70 font-helvetica">
                  Decimal
                </label>
                <div className="relative font-helvetica">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 text-white border bg-white/20 border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                    value={decimal}
                    onChange={(e) => setDecimal(e.target.value)}
                    disabled={true}
                  />
                  <span className="absolute text-sm transform -translate-y-1/2 right-4 top-1/2 text-white/50 font-helvetica">
                    fixed
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-col gap-2 mt-2 font-helvetica md:mt-0"
              variants={itemVariants}
            >
              <label className="text-sm text-white/70 font-helvetica">
                Optional Artwork
              </label>
              <div
                className="relative h-[200px] md:h-[250px] bg-[#1e1e44]/10 rounded-xl border border-dashed border-white/10 overflow-hidden flex items-center justify-center font-helvetica"
                style={{ padding: "10px" }}
              >
                {selectedImage ? (
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Image
                      src={selectedImage}
                      alt="Token artwork"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute p-2 rounded-full bottom-3 right-3 bg-black/50 backdrop-blur-sm">
                      <Upload className="w-4 h-4 text-white/70" />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full gap-3 cursor-pointer font-helvetica">
                    <div className="p-3 rounded-full bg-white/5">
                      <Upload className="w-6 h-6 text-blue-400/50" />
                    </div>
                    <span className="text-sm text-center text-white/60 font-helvetica">
                      Select or drop an image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                )}
              </div>
            </motion.div>
          </div>

          <motion.button
            className={`w-full mt-6 md:mt-8 py-3 rounded-full font-medium tracking-tight backdrop-blur-md shadow-inner shadow-black/40 transition-all text-sm font-helvetica flex items-center justify-center ${
              isFormValid && !isLoading
                ? "bg-gradient-to-b from-[#FFFFFF] to-[#8F90D4]/80 text-[#4c5bcd] active:scale-95 active:shadow-inner active:shadow-black/60 active:translate-y-0.5"
                : "bg-gradient-to-b from-[#FFFFFF]/40 to-[#4c5bcd]/50 text-[#ffffff]/40 cursor-not-allowed"
            }`}
            variants={itemVariants}
            onClick={handleMintTokens}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                minting...
              </>
            ) : (
              "mint tokens"
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      <Toaster
        position="bottom-center"
        duration={3000}
        closeButton
        richColors
        theme="dark"
        className="!fixed !bottom-6 !left-1/2 !transform !-translate-x-1/2"
      />
    </div>
  );
}

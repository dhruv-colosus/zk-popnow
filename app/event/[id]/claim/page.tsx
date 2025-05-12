"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  claimAirdrop,
  getEvent,
  incrementAirdropSupply,
} from "@/app/util/actions";
import { useParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SendTransactionError,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { connection } from "@/app/util/conn";
import bs58 from "bs58";
import Link from "next/link";

export default function BreakoutPage() {
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

  const eventId = useParams().id;
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState<Awaited<ReturnType<typeof getEvent>>>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId as string);
        if (!event) {
          setNotFound(true);
          return;
        }
        setEventInfo(event);
      } catch (error) {
        console.error("Error fetching event:", error);
        setNotFound(true);
      }
    };

    fetchEvent();
  }, [eventId]);

  const onClickClaim = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      const createdTx = await claimAirdrop(
        eventId as string,
        wallet.publicKey.toBase58()
      );
      const tx = Transaction.from(createdTx);

      const signedTransaction = await wallet.signTransaction(
        new VersionedTransaction(tx.compileMessage())
      );
      const escrow = Keypair.fromSecretKey(
        bs58.decode(process.env.NEXT_PUBLIC_ESCROW_KEY as string)
      );
      signedTransaction.sign([escrow]);

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction({
        signature,
        ...(await connection.getLatestBlockhash()),
      });
      await incrementAirdropSupply(eventId as string);

      alert("Successfully claimed token!");
    } catch (error) {
      console.error(error);
      if (error instanceof SendTransactionError) {
        console.log(await error.getLogs(connection));
      }
      alert("Failed to claim token");
    } finally {
      setIsLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/image/bg-2.png"
            alt="background"
            fill
            className="object-cover"
          />
        </div>
        <motion.div
          className="flex flex-col items-center justify-center z-10 mt-32 mb-12 md:mt-10 px-4 md:px-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-center text-[3rem] md:text-[4rem] leading-[3rem] md:leading-[4.2rem] tracking-tight drop-shadow-lg mb-1"
            variants={itemVariants}
          >
            <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
              Event Not Found
            </span>
          </motion.h1>
          <motion.p
            className="mt-3 text-center text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica mb-6"
            variants={itemVariants}
          >
            The event you're looking for doesn't exist or has been removed.
          </motion.p>
          <Link
            href="/event"
            className="px-6 py-3 bg-gradient-to-r from-[#7289FF] to-[#445299] text-white rounded-xl font-medium hover:opacity-90 transition-opacity duration-300"
          >
            View All Events
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/image/bg-2.png"
          alt="background"
          fill
          className="object-cover"
        />
      </div>

      <motion.div
        className="z-10 flex flex-col items-center justify-center px-4 mt-32 mb-12 md:mt-10 md:px-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-center text-[3rem] md:text-[4rem] leading-[3rem] md:leading-[4.2rem] tracking-tight drop-shadow-lg mb-1"
          variants={itemVariants}
        >
          <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
            Welcome to {eventInfo?.name || 'Breakout'}
          </span>
        </motion.h1>
        <motion.p
          className="mt-3 text-center text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica mb-6"
          variants={itemVariants}
        >
          Claim your PoP token by connecting your wallet and signing a transaction
        </motion.p>

        <motion.div
          className="bg-[#1a1a40]/20 backdrop-blur-md rounded-[70px] p-8 border border-white/5 shadow-lg max-w-sm w-full flex flex-col relative overflow-hidden"
          variants={itemVariants}
        >
          {eventInfo?.imageUrl && (
            <motion.div
              className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6"
              variants={itemVariants}
            >
              <Image
                src={eventInfo.imageUrl}
                alt={eventInfo.name}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          <motion.div
            className="bg-gradient-to-r from-[#DCE0FF] to-[#A8AFDE]/50 bg-clip-text text-transparent text-2xl font-medium font-helvetica mb-6 ml-2"
            variants={itemVariants}
          >
            {eventInfo?.slug ?
              `#${eventInfo.slug.substring(0, 4).toUpperCase()}${eventInfo.currentSupply || 0}` :
              '#BREAK0042'}
          </motion.div>

          <button
            className="w-full bg-gradient-to-b from-[#FFFFFF] shadow-inner shadow-black/40 to-[#8F90D4]/80 px-4 py-3 cursor-pointer rounded-full font-semibold transition-all flex items-center justify-center gap-2 tracking-tight backdrop-blur-md text-sm text-[#4c5bcd] active:scale-95 active:shadow-inner active:shadow-black/60 active:shadow-white/10 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClickClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-[#4c5bcd] border-r-[#4c5bcd]/40 border-b-[#4c5bcd]/20 border-l-[#4c5bcd]/80 rounded-full animate-spin"></div>
            ) : (
              'Claim Token'
            )}
          </button>

          <motion.div className="w-full mb-4" variants={itemVariants}>
            <div className="mt-8 mb-1 text-xs text-right text-white/60">
              {eventInfo?.totalSupply - eventInfo?.currentSupply || 0}/{eventInfo?.totalSupply || 1000} claimed
            </div>
            <div className="relative w-full h-2 bg-[#D9D9D9]/20 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#7289FF] to-[#445299] rounded-br-full"
                style={{
                  width: `${eventInfo && eventInfo.totalSupply > 0 ?
                    Math.min(100, ((eventInfo?.totalSupply - eventInfo.currentSupply) / eventInfo.totalSupply) * 100) :
                    0}%`
                }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

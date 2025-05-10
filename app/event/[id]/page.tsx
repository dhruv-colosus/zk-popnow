"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BreakoutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image src="/image/bg-2.png" alt="background" fill className="object-cover" />
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
                        Welcome to Breakout
                    </span>
                </motion.h1>
                <motion.p
                    className="mt-3 text-center text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica mb-6"
                    variants={itemVariants}
                >
                    Scan the QR with Solana Play to get your PoP token
                </motion.p>

                <motion.div
                    className="bg-[#1a1a40]/20 backdrop-blur-md rounded-[70px] p-8 border border-white/5 shadow-lg max-w-sm w-full flex flex-col relative overflow-hidden"
                    variants={itemVariants}
                >


                    {/* QR Code Placeholder */}
                    <motion.div
                        variants={itemVariants}
                    >
                        <Image src="/image/qr.png" alt="QR Code" width={300} height={100} className="object-contain  mx-auto rounded-[20px] mb-4" />
                    </motion.div>

                    <motion.div
                        className=" bg-gradient-to-r  from-[#DCE0FF] to-[#A8AFDE]/50 bg-clip-text text-transparent text-2xl font-medium font-helvetica mb-6 ml-2"
                        variants={itemVariants}
                    >
                        #BREAK0042
                    </motion.div>

                    <motion.div className="w-full mb-4" variants={itemVariants}>
                        <div className="mb-1 text-white/60 text-xs text-right mt-8">
                            42/1000 claimed
                        </div>
                        <div className="relative w-full h-2 bg-[#D9D9D9]/20 rounded-full overflow-hidden ">
                            <div className="absolute left-0 top-0 h-full w-[42%] bg-gradient-to-r from-[#7289FF] to-[#445299] rounded-br-full"></div>
                        </div>

                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
} 
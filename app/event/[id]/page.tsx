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
                className="flex flex-col items-center justify-center z-10 mt-16 md:mt-10 px-4 md:px-0"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h1
                    className="text-center text-[3rem] md:text-[4rem] leading-[3rem] md:leading-[4.2rem] tracking-tight drop-shadow-lg mb-10"
                    variants={itemVariants}
                >
                    <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
                        Welcome to Breakout
                    </span>
                </motion.h1>

                <motion.div
                    className="bg-[#1a1a40]/70 backdrop-blur-md rounded-3xl p-8 border border-[#727272]/20 shadow-lg max-w-lg w-full flex flex-col items-center"
                    variants={itemVariants}
                >
                    <motion.p
                        className="text-white/80 text-center mb-8"
                        variants={itemVariants}
                    >
                        Scan the QR with Solana Play to get yoyur PoP token
                    </motion.p>

                    {/* QR Code Placeholder */}
                    <motion.div
                        className="w-64 h-64 bg-[#2a2a50] rounded-xl overflow-hidden mb-4 relative border border-white/10"
                        variants={itemVariants}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            {/* Placeholder for the QR code */}
                            <div className="w-5/6 h-5/6 bg-[#333360] flex items-center justify-center">
                                <div className="w-4/5 h-4/5 bg-[#444480] flex items-center justify-center">
                                    <div className="w-3/5 h-3/5 bg-[#555590]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="text-white/70 text-lg font-medium mb-6"
                        variants={itemVariants}
                    >
                        #BREAK0042
                    </motion.div>

                    <motion.div className="w-full" variants={itemVariants}>
                        <div className="relative w-full h-4 bg-[#1e1e44] rounded-full overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-[42%] bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        </div>
                        <div className="mt-2 text-white/60 text-xs text-right">
                            42/1000 claimed
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
} 
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function EventsPage() {
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
                        How it Works ?
                    </span>
                </motion.h1>

            </motion.div>

            <motion.div
                className="flex flex-col items-center justify-center z-10 mt-8 px-4 md:px-0"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.p
                    className="mt-3  text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica"
                    variants={itemVariants}
                >
                    Our platform simplifies the process of launching PoP Tokens for your events. Here's a detailed breakdown of how it works:
                </motion.p>

                <motion.ul
                    className="mt-3  text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica"
                    variants={itemVariants}
                >
                    <li>Admin mints 1,000 leaves and receives 1,000 QR PNGs.</li>
                    <li>An attendee scans one unused QR code.</li>
                    <li>The attendee's wallet signs the claimCompressedToken with proof.</li>
                    <li>The program verifies the claim, and the ownership status of the leaf flips to "taken."</li>
                    <li>If the /event page was displaying that leaf, its polling loop detects the change and updates to show the next QR code, incrementing the claimed count.</li>
                    <li>Scanning any other unused QR code will succeed unless a "one per wallet" guard is implemented.</li>
                </motion.ul>

                <motion.p
                    className="mt-3  text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica"
                    variants={itemVariants}
                >
                    This seamless process ensures that each attendee can easily claim their participation token, enhancing the event experience.
                </motion.p>
            </motion.div>
        </div>
    );
} 
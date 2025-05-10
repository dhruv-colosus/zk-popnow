"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function CreatePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
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
                        Create your cToken
                    </span>
                </motion.h1>

                <motion.div
                    className="bg-[#1a1a40]/70 backdrop-blur-md rounded-3xl p-8 border border-[#727272]/20 shadow-lg max-w-4xl w-full"
                    variants={itemVariants}
                >
                    <motion.div variants={itemVariants}>
                        <h2 className="text-white font-helvetica text-xl font-medium mb-8">Create Your Event & Mint Participation Tokens</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                                <label className="text-white/70 text-sm">Event name</label>
                                <input
                                    type="text"
                                    placeholder="breakout"
                                    className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/30"
                                />
                            </motion.div>

                            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                                <label className="text-white/70 text-sm">Total supply</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="1000"
                                        className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-white/30"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm">tokens</span>
                                </div>
                            </motion.div>

                            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                                <label className="text-white/70 text-sm">Decimal</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-white/30"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm">fixed</span>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                            <label className="text-white/70 text-sm">Optional Artwork</label>
                            <div className="relative h-[250px] bg-[#1e1e44] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                                {selectedImage ? (
                                    <Image
                                        src={selectedImage}
                                        alt="Token artwork"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center gap-3 h-full w-full">
                                        <div className="bg-white/10 p-3 rounded-full">
                                            <Upload className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className="text-white/60 text-sm">Select or drop an image</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <motion.button
                        className="w-full mt-8 bg-gradient-to-b from-[#FFFFFF] to-[#8F90D4]/80 text-[#4c5bcd] py-3 rounded-full font-medium tracking-tight backdrop-blur-md shadow-inner shadow-black/40 active:scale-95 active:shadow-inner active:shadow-black/60 active:translate-y-0.5 transition-all text-sm"
                        variants={itemVariants}
                    >
                        mint tokens
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, XCircle } from "lucide-react";

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1e1e44]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 text-white font-helvetica shadow-lg z-50 flex items-center gap-2 max-w-[90%] w-auto"
        >
            <span>{message}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white">
                <XCircle size={18} />
            </button>
        </motion.div>
    );
};

export default function CreatePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [eventName, setEventName] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [decimal, setDecimal] = useState("0");
    const [toast, setToast] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const isFormValid = eventName.trim() !== "" && totalSupply.trim() !== "" && selectedImage !== null;

    const showToast = (message: string) => {
        setToast(message);
    };

    const closeToast = () => {
        setToast(null);
    };

    const handleMintTokens = () => {
        if (!isFormValid) {
            if (!eventName.trim()) {
                showToast("Please enter an event name");
            } else if (!totalSupply.trim()) {
                showToast("Please enter a total supply");
            } else if (!selectedImage) {
                showToast("Please select an image");
            }
            return;
        }

        const data = {
            eventName,
            totalSupply,
            decimal,
            selectedImage
        };
        console.log(JSON.stringify(data));
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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden font-helvetica">
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image src="/image/bg-2.png" alt="background" fill className="object-cover" />
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
                        <h2 className="bg-gradient-to-r from-[#f6f7ff] to-[#959edc]/70 bg-clip-text font-helvetica text-lg md:text-xl font-regular mb-6 md:mb-8 text-transparent">Create Your Event & Mint Participation Tokens</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 font-helvetica">
                        <div className="flex flex-col gap-5 md:gap-6 font-helvetica">
                            <motion.div className="flex flex-col gap-2 font-helvetica" variants={itemVariants}>
                                <label className="text-white/70 text-sm font-helvetica">Event name</label>
                                <input
                                    type="text"
                                    placeholder="event name ...."
                                    className="bg-white/5 text-white border border-white/10 rounded-2xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </motion.div>

                            <motion.div className="flex flex-col gap-2 font-helvetica" variants={itemVariants}>
                                <label className="text-white/70 text-sm font-helvetica">Total supply</label>
                                <div className="relative font-helvetica">
                                    <input
                                        type="number"
                                        placeholder="1000"
                                        className="bg-white/5 text-white border border-white/10 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                                        value={totalSupply}
                                        onChange={(e) => setTotalSupply(e.target.value)}
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm font-helvetica">tokens</span>
                                </div>
                            </motion.div>

                            <motion.div className="flex flex-col gap-2 font-helvetica" variants={itemVariants}>
                                <label className="text-white/70 text-sm font-helvetica">Decimal</label>
                                <div className="relative font-helvetica">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="bg-white/20 text-white border border-white/10 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white/30 font-helvetica"
                                        value={decimal}
                                        onChange={(e) => setDecimal(e.target.value)}
                                        disabled={true}
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm font-helvetica">fixed</span>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="flex flex-col gap-2 font-helvetica mt-2 md:mt-0" variants={itemVariants}>
                            <label className="text-white/70 text-sm font-helvetica">Optional Artwork</label>
                            <div className="relative h-[200px] md:h-[250px] bg-[#1e1e44]/10 rounded-xl border border-dashed border-white/10 overflow-hidden flex items-center justify-center font-helvetica" style={{ padding: '10px' }}>
                                {selectedImage ? (
                                    <div className="relative w-full h-full cursor-pointer" onClick={handleImageClick}>
                                        <Image
                                            src={selectedImage}
                                            alt="Token artwork"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                                            <Upload className="w-4 h-4 text-white/70" />
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center gap-3 h-full w-full font-helvetica">
                                        <div className="bg-white/5 p-3 rounded-full">
                                            <Upload className="w-6 h-6 text-blue-400/50" />
                                        </div>
                                        <span className="text-white/60 text-sm font-helvetica text-center">Select or drop an image</span>
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
                        className={`w-full mt-6 md:mt-8 py-3 rounded-full font-medium tracking-tight backdrop-blur-md shadow-inner shadow-black/40 transition-all text-sm font-helvetica ${isFormValid
                            ? "bg-gradient-to-b from-[#FFFFFF] to-[#8F90D4]/80 text-[#4c5bcd] active:scale-95 active:shadow-inner active:shadow-black/60 active:translate-y-0.5"
                            : "bg-gradient-to-b from-[#FFFFFF]/40 to-[#4c5bcd]/50 text-[#ffffff]/40 cursor-not-allowed"
                            }`}
                        variants={itemVariants}
                        onClick={handleMintTokens}
                        disabled={!isFormValid}
                    >
                        mint tokens
                    </motion.button>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {toast && <Toast message={toast} onClose={closeToast} />}
            </AnimatePresence>
        </div>
    );
}

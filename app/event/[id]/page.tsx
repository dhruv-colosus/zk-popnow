"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getEvent } from "@/app/util/actions";
import { useParams } from "next/navigation";
import QRCode from 'qrcode';

export default function BreakoutPage() {
    const [eventInfo, setEventInfo] =
        useState<Awaited<ReturnType<typeof getEvent>>>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const eventId = useParams().id;

    const generateQR = useCallback(async (url: string) => {
        try {
            return await QRCode.toDataURL(url, {
                margin: 1,
                width: 300,
                color: {
                    dark: '#FFFFFFE6',
                    light: '#00000000'
                }
            });
        } catch (err) {
            console.error("Error generating QR code:", err);
            throw new Error("Failed to generate QR code");
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // First generate QR code with just the ID
                const claimUrl = `${process.env.NEXT_PUBLIC_URL_PREFIX || window.location.origin}/event/${eventId}/claim`;
                console.log("Generating QR code for URL:", claimUrl);

                const qrCode = await generateQR(claimUrl);
                if (isMounted) {
                    setQrCodeDataUrl(qrCode);
                    console.log("QR code set to state successfully");
                }

                // Then fetch event data
                console.log("Fetching event info for ID:", eventId);
                const event = await getEvent(eventId as string);
                if (isMounted) {
                    console.log("Event data received:", event);
                    setEventInfo(event);
                }
            } catch (err) {
                console.error("Error:", err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Unknown error occurred");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [eventId, generateQR]);

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

    // Debug output
    console.log("Current render state:", {
        isLoading,
        hasQrCode: !!qrCodeDataUrl,
        qrCodeLength: qrCodeDataUrl?.length,
        error
    });

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
                    {/* QR Code with Loader */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full aspect-square flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-20 h-20 border-4 border-t-[#7289FF] border-r-[#7289FF]/40 border-b-[#7289FF]/20 border-l-[#7289FF]/80 rounded-full animate-spin"></div>
                            </div>
                        ) : qrCodeDataUrl ? (
                            <div className="p-4 rounded-lg">
                                <img
                                    src={qrCodeDataUrl}
                                    alt="QR Code"
                                    className="w-[100%] h-[100%] mx-auto"
                                />
                            </div>
                        ) : (
                            <div className="text-white/80 text-center p-4">
                                {error || "Failed to generate QR code. Please refresh the page."}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-r from-[#DCE0FF] to-[#A8AFDE]/50 bg-clip-text text-transparent text-2xl font-medium font-helvetica mb-6 ml-2 mt-4"
                        variants={itemVariants}
                    >
                        {eventInfo?.slug ?
                            `#${eventInfo.slug.substring(0, 4).toUpperCase()}${eventInfo.claimedCount || 0}` :
                            '#BREAK0042'}
                    </motion.div>

                    <motion.div className="w-full mb-4" variants={itemVariants}>
                        <div className="mb-1 text-white/60 text-xs text-right mt-8">
                            {eventInfo?.claimedCount || 42}/{eventInfo?.totalCount || 1000} claimed
                        </div>
                        <div className="relative w-full h-2 bg-[#D9D9D9]/20 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#7289FF] to-[#445299] rounded-br-full"
                                style={{
                                    width: `${eventInfo && eventInfo.totalCount > 0 ?
                                        Math.min(100, (eventInfo.claimedCount / eventInfo.totalCount) * 100) :
                                        4.2}%`
                                }}
                            ></div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAllEvents } from "@/app/util/actions";
import Link from "next/link";
import type { Event } from "@prisma/client/edge";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
            <div className="fixed inset-0 z-0 select-none pointer-events-none">
                <Image
                    src="/image/bg-2.png"
                    alt="background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <motion.div
                className="flex flex-col items-center justify-center z-10 mt-16 md:mt-10 px-4 md:px-0 w-full max-w-7xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h1
                    className="text-center text-[3rem] md:text-[4rem] leading-[3rem] md:leading-[4.2rem] tracking-tight drop-shadow-lg mb-10 mt-16"
                    variants={itemVariants}
                >
                    <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
                        Live Events
                    </span>
                </motion.h1>

                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <div className="w-20 h-20 border-4 border-t-[#7289FF] border-r-[#7289FF]/40 border-b-[#7289FF]/20 border-l-[#7289FF]/80 rounded-full animate-spin"></div>
                    </div>
                ) : events.length === 0 ? (
                    <motion.div
                        className="text-white/60 text-center text-lg"
                        variants={itemVariants}
                    >
                        No events available at the moment.
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10"
                        variants={containerVariants}
                    >
                        {events.map((event) => (
                            <motion.div
                                key={event.id}
                                className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                                variants={itemVariants}
                            >
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                <h3 className="text-xl font-medium text-white mb-2 font-helvetica">
                                    {event.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-white/60 font-helvetica">
                                        Token: {event.name.slice(0, 4).toUpperCase()}
                                    </span>
                                    <span className="text-sm text-white/60 font-helvetica">
                                        • {event.currentSupply}/{event.totalSupply} claimed
                                    </span>
                                </div>

                                <Link
                                    href={`/event/${event.slug}`}
                                    className="w-full bg-gradient-to-r from-[#7289FF]/10 to-[#445299]/30 text-white py-3 px-6 rounded-xl text-center font-medium hover:opacity-90 transition-opacity duration-300 block"
                                >
                                    View Event
                                </Link>
                            </motion.div>

                        ))}

                    </motion.div>
                )}
            </motion.div>
        </div>
    );
} 
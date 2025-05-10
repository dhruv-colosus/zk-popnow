'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Navbar() {
    return (
        <header className="absolute w-full flex justify-between items-center px-4 md:px-24 pt-8 z-20 ">
            <Link href="/" className="text-white text-xl font-bold tracking-tight">popnow</Link>
            <WalletMultiButton />
        </header>
    );
} 
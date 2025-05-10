
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image src="/image/bg.png" alt="background" fill className="object-cover w-full " />
      </div>

      <main className="flex flex-col items-center justify-center flex-1 w-full z-10 -mt-16 px-4 md:px-0">
        <div className="mb-4">
          <div className="bg-[#3b2e7e61] text-[10px] text-white px-3 py-0.5 rounded-full  shadow-inner shadow-white/10 border border-[#727272]/30 tracking-tight flex items-center gap-1">
            <Image src="/image/star.png" alt="star" width={12} height={12} />
            <span className='text-[#79a4dc]'>supports ZK compression</span>
          </div>
        </div>

        <p className="text-center text-[2.2rem] md:text-[3.9rem]  leading-[2.5rem] md:leading-[4rem] tracking-tight drop-shadow-lg relative inline-block">
          <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
            Launch PoP Tokens<br />for your event instantly
          </span>
        </p>

        <p className="mt-3 text-center text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica ">
          Launch cTokens as proof-of-participation for your Web3 event, QR-accessible in just a few clicks.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3 z-10">
          <Link href="/create" className="bg-gradient-to-b from-[#FFFFFF] shadow-inner shadow-black/40 to-[#8F90D4]/80 px-4 py-2 cursor-pointer rounded-full font-semibold  transition-all flex items-center gap-2  tracking-tight backdrop-blur-md text-sm text-[#4c5bcd] active:scale-95 active:shadow-inner active:shadow-black/60 active:shadow-white/10 active:translate-y-0.5">
            Create an event now
            <span className=""><ArrowUpRight strokeWidth={3} className='w-4 h-4' /></span>
          </Link>
          <Link href="/event" className="bg-white/10 border border-white/20 text-white px-8 py-2 rounded-full shadow-sm cursor-pointer hover:bg-white/20 transition-all text-sm font-medium tracking-tight backdrop-blur-md active:scale-95 active:shadow-inner active:shadow-black/60 active:shadow-white/10 active:translate-y-0.5">
            Live events
          </Link>
        </div>
      </main>

      <div className="w-full flex justify-center pb-8">
        <div className="absolute -bottom-10 md:-bottom-25 select-none pointer-events-none ">
          <Image src="/image/bottom.png" alt="QR Code" width={700} height={120} className="object-contain  " />
        </div>
      </div>
    </div>
  );
}

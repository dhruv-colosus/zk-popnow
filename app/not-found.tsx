import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/image/bg.png"
          alt="background"
          fill
          className="object-cover w-full "
        />
      </div>

      <main className="flex flex-col items-center justify-center flex-1 w-full z-10 px-4 md:px-0">
        <h2 className="text-center text-[2.2rem] md:text-[3.9rem] leading-[2.5rem] md:leading-[4rem] tracking-tight drop-shadow-lg relative inline-block">
          <span className="font-helvetica bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0)_120%)] bg-clip-text text-transparent font-medium">
            404 Not found
          </span>
        </h2>

        <p className="mt-3 text-center text-base md:text-lg bg-gradient-to-r from-[#DCE0FF]/70 to-[#A8AFDE] bg-clip-text leading-[1.2rem] text-transparent max-w-xl tracking-tight font-helvetica">
          Could not find the requested resource.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3 z-10">
          <Link
            href="/"
            className="bg-gradient-to-b from-[#FFFFFF] shadow-inner shadow-black/40 to-[#8F90D4]/80 px-4 py-2 cursor-pointer rounded-full font-semibold transition-all flex items-center gap-2 tracking-tight backdrop-blur-md text-sm text-[#4c5bcd] active:scale-95 active:shadow-inner active:shadow-black/60 active:shadow-white/10 active:translate-y-0.5"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";


export const metadata = {
  title: "Home | " + process.env.WEBSITE_NAME,
  description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
  openGraph: {
      type: 'website',
      locale: 'en_US',
      title: "Home | " + process.env.WEBSITE_NAME,
      description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
      images: [
          {
              url: `${process.env.WEBSITE_URL}/images/bg.png`,
              alt: "Home | " + process.env.WEBSITE_NAME,
              width: 800,
              height: 600,
              type: 'image/png',
          },
      ],
  },
}; 

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-10">
      <h1 className="text-4xl font-extrabold font-mono text-center">TRANSMISSION SYSTEM ANALYSIS</h1>
      <div className="flex flex-wrap items-center justify-center w-full h-full gap-5">
        <Link href="/double-circuit" className="w-full max-w-[350px] border border-gray-400 h-[400px] rounded-3xl overflow-hidden relative shadow-3xl group">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 group-hover:scale-110 transition-all">
            <h2 className="text-3xl font-mono font-bold bg-[url(/images/bg9.jpg)] bg-cover bg-center bg-clip-text text-transparent">Double Circuit</h2>
          </div>
        </Link>
        <Link href="/single-circuit" className="w-full max-w-[350px] h-[400px] border rounded-3xl overflow-hidden relative shadow-3xl group">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 group-hover:scale-110 transition-all">
            <h2 className="text-3xl font-mono font-bold bg-[url(/images/bg3.jpg)] bg-cover bg-center bg-clip-text text-transparent">Single Circuit</h2>
          </div>
        </Link>
      </div>
    </div>
  )
}

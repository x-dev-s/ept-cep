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
      <div className="flex items-center justify-center w-full h-full gap-5">
        <Link href="/double-circuit" className="w-full max-w-[350px] border h-[400px] rounded-2xl overflow-hidden">
          <Image src="/images/double_circuit.png" alt="Double Circuit" width={350} height={350} className="object-contain mix-blend-darken hover:scale-110 transition-all" />
        </Link>
        <Link href="/single-circuit" className="w-full max-w-[350px] h-[400px] border rounded-2xl overflow-clip">
          <Image src="/images/single_circuit.png" alt="Single Circuit" width={350} height={350} className="object-contain mix-blend-darken hover:scale-110 transition-all" />
        </Link>
      </div>
    </div>
  )
}

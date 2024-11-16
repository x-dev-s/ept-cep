import { Inter, Archivo_Black, Anton } from "next/font/google";
import "./globals.css";
import PageLoading from "@/components/pageLoading";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-text',
});

const mono = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-heading",
});

const serif = Anton({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-serif",
});

export const metadata = {
  metadataBase: new URL(`${process.env.WEBSITE_URL}`),
  title: process.env.WEBSITE_NAME,
  description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
  robots: {
    index: false,
    follow: true,
    nocache: false,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${process.env.WEBSITE_URL}`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${process.env.WEBSITE_URL}`,
    title: process.env.WEBSITE_NAME,
    description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
    images: [
      {
        url: `${process.env.WEBSITE_URL}/images/bg1.jpg`,
        alt: process.env.WEBSITE_NAME,
        width: 800,
        height: 600,
        type: 'image/jpg',
      },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sans.className} ${mono.className} ${serif.className} flex flex-col justify-center self-center mx-auto font-sans text-sm`}
      >
        <main className="min-h-dvh relative flex flex-col justify-center items-center text-gray-100">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
          </div>
            <div className="container z-10 px-3 py-10 flex flex-col justify-center">
              {children}
            </div>
            <PageLoading />
        </main>
      </body>
    </html >
  );
}

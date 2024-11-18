import DoubleCircuit from "@/components/doubleCircuit";


export const metadata = {
    title: "Double Circuit | " + process.env.WEBSITE_NAME,
    description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
    openGraph: {
        type: 'website',
        locale: 'en_US',
        title: "Double Circuit | " + process.env.WEBSITE_NAME,
        description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
        images: [
            {
                url: `${process.env.WEBSITE_URL}/images/bg.png`,
                alt: "Double Circuit | " + process.env.WEBSITE_NAME,
                width: 800,
                height: 600,
                type: 'image/png',
            },
        ],
    },
};

export default function DoubleCircuitPage(){
    return <DoubleCircuit />
}
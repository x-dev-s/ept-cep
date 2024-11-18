import SingleCircuit from "@/components/singleCircuit";

export const metadata = {
    title: "Single Circuit | " + process.env.WEBSITE_NAME,
    description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
    openGraph: {
        type: 'website',
        locale: 'en_US',
        title: "Single Circuit | " + process.env.WEBSITE_NAME,
        description: "A hub for engineers to perform the technical analysis of electrical transmission systems.",
        images: [
            {
                url: `${process.env.WEBSITE_URL}/images/bg.png`,
                alt: "Single Circuit | " + process.env.WEBSITE_NAME,
                width: 800,
                height: 600,
                type: 'image/png',
            },
        ],
    },
    };

export default function SingleCircuitPage(){
    return <SingleCircuit />
}
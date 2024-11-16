'use client';
import { useState } from "react";

export default function PageLoading() {
    const [loading, setLoading] = useState(true);
    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-dvw h-dvh bg-white z-20 flex items-center justify-center">
                    <video
                        className="w-full max-w-[400px] object-contain mix-blend-darken"
                        autoPlay
                        muted
                        src="/images/loading.mp4"
                        onEnded={() => setLoading(false)}
                    />
                </div>
            )}
        </>
    )
}
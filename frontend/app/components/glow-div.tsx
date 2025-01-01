import React from 'react';
import { motion } from 'framer-motion';

export default function GlowDiv({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <>
            <motion.section className="absolute z-40 right-[10rem] top-[12rem] hidden rotate-12 items-center justify-center drop-shadow-[0_60px_100px_#bbc4c3] lg:flex">
                <motion.div
                    className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br bg-white md:h-48 md:w-48"
                    style={{
                        
                        transform: 'rotate(12deg)',
                    }}
                >
                    <motion.div className="borer-2 w-fit rounded-3xl px-4 py-4">
                        {children}
                    </motion.div>
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-500 opacity-30" />

                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent opacity-90"
                        style={{
                            mixBlendMode: 'soft-light',
                        }}
                    />

                    <motion.div
                        className="bg-gradient-radial absolute inset-0 from-gray-100 to-transparent opacity-50"
                        style={{
                            background:
                                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%)',
                        }}
                    />

                </motion.div>
            </motion.section>
        </>
    );
}

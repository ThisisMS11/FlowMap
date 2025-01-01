import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp } from 'lucide-react';
import GlowDiv from '../glow-div';
import { MoveRight } from 'lucide-react';
import { motion } from 'framer-motion';
import flowchart from '@/app/assets/flow-chart.png';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function Hero() {
    const router = useRouter();
    return (
        <>
            <div className="h-fit pb-32 w-full dark:bg-black bg-white  dark:bg-dot-white/[0.5] bg-dot-black/[0.2] relative flex">
                <div className="w-full absolute border-red-500 top-0 h-[10rem] bg-gradient-to-b from-background to-transparent z-[1]"></div>
                <div className="w-full absolute border-t-2 border-green-500 bottom-0 h-[5rem] backdrop-blur-sm bg-gradient-to-t from-background via-background/80 to-transparent z-[1]"></div>
                <div className="w-[90%] h-full absolute border-yellow-500 left-0  bg-gradient-to-r from-background via-background/80 to-transparent z-[1]"></div>
                <div className="w-[20%] h-full absolute border-yellow-500 right-0  bg-gradient-to-l from-background via-background/80 to-transparent z-[1]"></div>

                <main className="max-w-6xl relative z-20 w-full mx-auto">
                    <div className="p-4">
                        {/* Radial gradient for the container to give a faded look */}
                        {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
                        <div className="flex  flex-col gap-4 md:mx-10 items-start justify-center h-fit pt-14">
                            <div className="font-primary text-4xl md:text-5xl lg:text-6xl flex flex-col text-center font-bold items-start">
                                <div>Transform Your Ideas</div>
                                <div>Into Flowcharts Instantly.</div>
                            </div>
                            <div className="w-full text-xs sm:text-sm md:w-[50%] text-left">
                                Describe your process, workflow, or plan, and
                                let AI turn it into a clear, professional
                                flowchart effortlessly.
                            </div>

                            <div className="flex items-center mt-2 gap-4">
                                <Button className="flex" onClick={() => { router.push('/canvas') }}>
                                    Quick Try 
                                    <motion.div
                                        className="mx-2"
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <MoveRight />
                                    </motion.div>
                                </Button>
                            </div>
                            <div className="mt-8">
                                <div className="font-semibold flex items-center gap-2 mb-2 text-sm">
                                    Recent Conversions{' '}
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <div className="border-2 h-36 flex flex-col rounded-xl w-[22rem] px-2 py-2 bg-accent">
                                    <div className="leading-tight flex-1">
                                        <h3 className="font-semibold">
                                            AI-Generated Flowchart: Streamlined
                                            Team Collaboration Workflow
                                        </h3>
                                        <div className="text-xs flex items-center gap-2 mt-2 text-foreground/70">
                                            <div>@ai_flowcharts</div>|
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />{' '}
                                                16/12/2024
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button variant={'link'}>
                                            View Flowchart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <GlowDiv>
                            {/* @ts-ignore  */}

                            <Image src={flowchart} alt='flow Chart Icon' width={225} height={225} className="text-black fill-black " />
                        </GlowDiv>
                    </div>
                </main>
            </div>
        </>
    );
}

'use client';
import Hero from '@/components/landing/hero';
import Navbar from '@/components/landing/navbar';

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            <Navbar />
            <Hero />
        </div>
    );
}

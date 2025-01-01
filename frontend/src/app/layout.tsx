import type { Metadata } from 'next';
import { Figtree, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';

const figtree = Figtree({
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-figtree',
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-jakarta',
});

export const metadata: Metadata = {
    title: 'flowchart',
    description: 'make flow charts in second',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    figtree.variable,
                    jakarta.variable,
                    'font-secondary'
                )}
            >
                <div className="pt-[0px]">
                    <SidebarProvider>{children}</SidebarProvider>
                </div>
            </body>
        </html>
    );
}

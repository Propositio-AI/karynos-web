import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppFrame } from '@/components/ui/templates/AppFrame';

const notoSansJP = Noto_Sans_JP({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-noto-sans-jp',
    display: 'swap',
    preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    variable: '--font-jakarta',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Karynos',
    description: 'Career discovery app by Karynos',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" className={`${notoSansJP.variable} ${plusJakartaSans.variable}`}>
            <body className="m-0 bg-canvas p-0 text-ink antialiased">
                <AppFrame>
                    {children}
                </AppFrame>
            </body>
        </html>
    );
}

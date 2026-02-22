import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/ui/templates/NavBar';

export const metadata: Metadata = {
    title: 'Karynos',
    description: '',
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className='p-0 m-0'>
                <div className="min-h-screen pb-24">
                    {children}
                </div>
                <NavBar />
            </body>
        </html>
    );
}

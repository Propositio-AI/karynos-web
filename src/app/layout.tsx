import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import './globals.css';

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
                {children}
            </body>
        </html>
    );
}

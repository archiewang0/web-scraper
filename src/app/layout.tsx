import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/layout/navbar'
import { AuthProvider } from '@/components/layout/auth-provider'
import 'react-loading-skeleton/dist/skeleton.css'
import { QueryProvider } from '@/components/layout/query-provider'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: '網頁爬蟲',
    description: '針對你想要爬蟲的網頁,進行爬蟲整理成卡片方便查閱資訊',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="light">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-400`}
            >
                <QueryProvider>
                    <AuthProvider>
                        <NavBar />
                        <main className="flex-grow">{children}</main>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}

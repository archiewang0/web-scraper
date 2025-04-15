import { Metadata } from 'next'
import ResultsPage from '@/features/result/result-page'

export const metadata: Metadata = {
    title: '爬蟲結果頁',
    description: '瀏覽爬蟲的結果',
}

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
            <ResultsPage />
        </main>
    )
}

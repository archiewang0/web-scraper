import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { scrapeWebsite, scrapeWebsiteAll } from '@/app/actions/scrape-web'
import { ScrapeConfigRequest } from '@/features/setting'
import { Fields } from '@/features/setting/types/form.type'

interface ScrapeResult {
    name: string
    url: string
    results: Fields[]
}

const SCRAPER_KEY = 'web-scraper'
/**
 * 使用 React Query 對網頁爬蟲功能進行緩存優化的 Hook
 *
 * @param config 爬蟲配置
 * @param options 額外的 React Query 選項
 * @returns 查詢結果
 */
export function useWebScraper(
    config: ScrapeConfigRequest[],
    options?: {
        enabled?: boolean
        refetchInterval?: number | false
        staleTime?: number
        cacheTime?: number
    }
) {
    return useQuery({
        queryKey: [SCRAPER_KEY, ...config.map((item) => item.name)],
        queryFn: () => scrapeWebsiteAll(config),
    })
}

export function useWebScraperMutation() {
    return useMutation({
        mutationFn: scrapeWebsiteAll,
    })
}

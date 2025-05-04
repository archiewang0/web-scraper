import { useQueries, useQuery } from '@tanstack/react-query'
import { finduser } from '@/app/actions/finduser'

const USER_KEY = 'user'
/**
 * 使用 React Query 對網頁爬蟲功能進行緩存優化的 Hook
 *
 * @param config 爬蟲配置
 * @param options 額外的 React Query 選項
 * @returns 查詢結果
 */
export function useFindUser(
    userId?: string,
    options?: {
        enabled?: boolean
        refetchInterval?: number | false
        staleTime?: number
        cacheTime?: number
    }
) {
    // 確保即使 userId 是 undefined，我們也會返回一個有效的 hook 結果
    // 這樣可以確保 hooks 的調用順序在組件間保持一致
    // 不要提前返回非 hook 的值
    return useQuery({
        queryKey: [USER_KEY, userId],
        queryFn: () => finduser({ userId }),
        // 確保只有在 userId 存在時才執行查詢
        // 有可能沒有 userId
        enabled: !!userId,
        ...options,
    })
}

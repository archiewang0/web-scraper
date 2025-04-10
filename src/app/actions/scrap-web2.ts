'use server'

import * as cheerio from 'cheerio'
import { fieldTypesEnums } from '@/features/setting-page'

interface FieldArr {
    type: fieldTypesEnums
    selector: string
}

type Fields = {
    [key in fieldTypesEnums]?: string
}

interface ScrapeConfig {
    url: string
    name: string
    fields: Fields
}

export interface res {
    name: string
    url: string
    timestamp: string
    results: result[]
}
interface result {
    // parent?: string;
    title: string
    url: string
    img?: string
    time?: string
    content?: string
}

export async function scrapeWebsite2(config: ScrapeConfig): Promise<res> {
    try {
        // 移除不必要的 console.log

        // 使用 AbortController 設置超時
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超時

        // Fetch the HTML content with timeout
        const response = await fetch(config.url, {
            signal: controller.signal,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        }).finally(() => clearTimeout(timeoutId))

        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${config.url}: ${response.statusText}`
            )
        }

        const html = await response.text()
        const $ = cheerio.load(html) // 使用 decodeEntities: false 可能提高效能

        // 預先解析基礎 URL，避免重複創建 URL 對象
        const baseUrl = new URL(config.url)

        // 預先檢查必要的欄位是否存在
        if (
            !config.fields.parent ||
            !config.fields.title ||
            !config.fields.url
        ) {
            throw new Error(
                'Missing required fields: parent, title, and url selectors are required'
            )
        }

        // 使用更高效的選擇器
        const parentElements = $(config.fields.parent).toArray()
        const results: result[] = []

        // 一次性選擇所有元素並批次處理
        for (const element of parentElements) {
            const $element = $(element)

            // 一次性查找所有需要的元素
            const $url = $element.find(config.fields.url)
            const href = $url.attr('href')

            // 如果沒有 URL，跳過
            if (!href) continue

            // 使用已存在的 baseUrl 對象創建完整 URL
            const fullUrl = new URL(href, baseUrl.toString()).toString()

            // 查找標題
            const title = $element.find(config.fields.title).text().trim()
            if (!title) continue // 如果沒有標題，跳過

            // 建立結果對象
            const data: result = {
                title,
                url: fullUrl,
            }

            // 處理可選欄位 - 儘量減少 DOM 操作
            if (config.fields.img) {
                const src = $element.find(config.fields.img).attr('src')
                if (src) data.img = new URL(src, baseUrl.toString()).toString()
            }

            if (config.fields.time) {
                data.time = $element.find(config.fields.time).text().trim()
            }

            if (config.fields.content) {
                data.content = $element
                    .find(config.fields.content)
                    .text()
                    .trim()
            }

            results.push(data)
        }

        // 平行處理結果，優化對象操作
        return {
            name: config.name,
            url: config.url,
            timestamp: new Date().toISOString(),
            results,
        }
    } catch (error) {
        console.error('Scraping error:', error)
        throw new Error(`Failed to scrape website: ${(error as Error).message}`)
    }
}

'use server'

import * as cheerio from 'cheerio'
import { fieldTypesEnums } from '@/features/setting/types/form.type'
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

interface res {
    name: string
    url: string
    results: result[]
}
interface result {
    parent: string
    title: string
    url: string

    img?: string
    time?: string
    content?: string
}

export async function scrapeWebsite(config: ScrapeConfig): Promise<res> {
    try {
        console.log('run there!!!')
        console.log('check config: ', config)

        // Fetch the HTML content
        const response = await fetch(config.url)
        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${config.url}: ${response.statusText}`
            )
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Extract data based on the provided selectors
        const results: any[] = []

        console.log('config.fields.parent: ', config.fields.url)

        $(config.fields.parent).each((_, element) => {
            let data: Fields = {}

            if (config.fields.url) {
                const href = $(element).find(config.fields.url).attr('href')
                data.url = href ? new URL(href).toString() : ''
            }

            if (config.fields.img) {
                data.img = $(element).find(config.fields.img).attr('src') || ''
            }

            if (config.fields.title) {
                data.title = $(element).find(config.fields.title).text().trim()
            }

            if (config.fields.time) {
                data.time = $(element).find(config.fields.time).text().trim()
            }

            if (config.fields.content) {
                data.content = $(element)
                    .find(config.fields.content)
                    .text()
                    .trim()
            }
            results.push(data)
        })

        return {
            name: config.name,
            url: config.url,
            results,
        }
    } catch (error) {
        console.error('Scraping error:', error)
        throw new Error(`Failed to scrape website: ${(error as Error).message}`)
    }
}

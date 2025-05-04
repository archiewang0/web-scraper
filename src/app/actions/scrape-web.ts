'use server'

import * as cheerio from 'cheerio'
import { fieldTypesEnums, Fields } from '@/features/setting/types/form.type'
import { ScrapeConfigRequest } from '@/features/setting'
interface FieldArr {
    type: fieldTypesEnums
    selector: string
}

interface res {
    name: string
    url: string
    results: result[]
}
interface result extends Fields {
    // parent: string
    // title: string
    // url: string
    // img?: string
    // time?: string
    // content?: string
}

export async function scrapeWebsite(config: ScrapeConfigRequest): Promise<res> {
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
        const results: result[] = []

        console.log('config.fields.parent: ', config.fieldsMap.url)

        $(config.fieldsMap.parent).each((_, element) => {
            let data: Fields = {}

            if (config.fieldsMap.url) {
                const href = $(element).find(config.fieldsMap.url).attr('href')
                data.url = href ? new URL(href).toString() : ''
            }

            if (config.fieldsMap.img) {
                data.img =
                    $(element).find(config.fieldsMap.img).attr('src') || ''
            }

            if (config.fieldsMap.title) {
                data.title = $(element)
                    .find(config.fieldsMap.title)
                    .text()
                    .trim()
            }

            if (config.fieldsMap.time) {
                data.time = $(element).find(config.fieldsMap.time).text().trim()
            }

            if (config.fieldsMap.content) {
                data.content = $(element)
                    .find(config.fieldsMap.content)
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

export async function scrapeWebsiteAll(
    configs: ScrapeConfigRequest[]
): Promise<res[]> {
    try {
        const allsettled = await Promise.allSettled(
            configs.map(async (config) => {
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
                const results: result[] = []

                console.log('config.fields.parent: ', config.fieldsMap.url)

                $(config.fieldsMap.parent).each((_, element) => {
                    let data: Fields = {}

                    if (config.fieldsMap.url) {
                        const href = $(element)
                            .find(config.fieldsMap.url)
                            .attr('href')
                        data.url = href ? new URL(href).toString() : ''
                    }

                    if (config.fieldsMap.img) {
                        data.img =
                            $(element).find(config.fieldsMap.img).attr('src') ||
                            ''
                    }

                    if (config.fieldsMap.title) {
                        data.title = $(element)
                            .find(config.fieldsMap.title)
                            .text()
                            .trim()
                    }

                    if (config.fieldsMap.time) {
                        data.time = $(element)
                            .find(config.fieldsMap.time)
                            .text()
                            .trim()
                    }

                    if (config.fieldsMap.content) {
                        data.content = $(element)
                            .find(config.fieldsMap.content)
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
            })
        )

        const successRes = allsettled
            .filter((item) => item.status === 'fulfilled')
            .map((item) => item.value)

        return successRes
    } catch (error) {
        console.error('Scraping error:', error)
        throw new Error(`Failed to scrape website: ${(error as Error).message}`)
    }
}

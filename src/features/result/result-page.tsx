'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Loading from '../../components/ui/loading'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible'

interface ScrapeResult {
    name: string
    url: string
    timestamp: string
    results: Record<string, string>[]
}

export default function ResultsPage() {
    const [scrapeData, setScrapeData] = useState<ScrapeResult[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedData = sessionStorage.getItem('scrapeResults')
        if (storedData) {
            try {
                setScrapeData(JSON.parse(storedData))
            } catch (error) {
                console.error('Failed to parse scrape data:', error)
            }
        }

        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <Loading />
    }

    if (!scrapeData) {
        return (
            <div className="container max-w-5xl py-10">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold">
                                No Scrape Results Found
                            </h2>
                            <p>Please configure and run a scrape first.</p>
                            <Button asChild>
                                <Link href="/setting">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Scraper Configuration
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className=" w-full py-10">
            <Button asChild variant="outline">
                <Link href="/setting">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Configuration
                </Link>
            </Button>

            {scrapeData.map((data, idx) => {
                return (
                    <Collapsible key={idx} className=" w-ful">
                        <CollapsibleTrigger className=" w-full ">
                            <div className=" transition-all shadow-xl p-5  rounded-xl flex items-center justify-between mb-6 w-full bg-gray-400 hover:bg-gray-300/20">
                                <div className="text-left">
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 className="text-3xl text-white font-bold">
                                            {data.name ||
                                                `${decodeURI(data.url).slice(
                                                    0,
                                                    30
                                                )}...`}
                                        </h1>
                                    </a>

                                    <p className="text-sm text-white/90">
                                        {new Date(
                                            data.timestamp
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className=" text-white">
                                    {data.results.length} items
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className=" p-5 border border-gray-400 shadow-2xl">
                            {data.results.length === 0 ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p>
                                                No results found. Try adjusting
                                                your selectors.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                    {data.results.map((item, index) => (
                                        <Card
                                            key={index}
                                            className=" w-[calc(25%-0.5rem)] overflow-hidden flex flex-col"
                                        >
                                            {item.img && (
                                                <div className="relative w-full h-48 overflow-hidden">
                                                    <img
                                                        src={item.img}
                                                        alt={item.title}
                                                        className=" object-cover"
                                                        onError={(e) => {
                                                            // Fallback for broken images
                                                            ;(
                                                                e.target as HTMLImageElement
                                                            ).src =
                                                                '/placeholder.svg?height=200&width=400'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2">
                                                    {item.title ||
                                                        `Item ${index + 1}`}
                                                </CardTitle>
                                                {item.time && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.time}
                                                    </p>
                                                )}
                                            </CardHeader>
                                            <CardContent>
                                                {item.content && (
                                                    <p className="text-sm line-clamp-3">
                                                        {item.content}
                                                    </p>
                                                )}
                                            </CardContent>
                                            <CardFooter className="mt-auto">
                                                {item.url && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            View Original
                                                        </a>
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                )
            })}
        </div>
    )
}

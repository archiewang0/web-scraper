'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, MinusCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
// import { Checkbox } from "@/components/ui/checkbox";
import { RequiredSignal } from '../components/ui/reqireed-icon'
import { scrapeWebsite } from '@/app/actions/scrape-web'
import { arrayToObject } from '@/lib/utils'
import { scrapeWebsite2 } from '@/app/actions/scrap-web2'

export enum fieldTypesEnums {
    title = 'title',
    url = 'url',
    img = 'img',
    time = 'time',
    content = 'content',
    parent = 'parent',
}

interface Field {
    id: number
    type: fieldTypesEnums
    selector: string
}

export default function SettingPage() {
    const router = useRouter()
    const [url, setUrl] = useState(
        'https://www.dalang.tw/%e5%8f%b0%e5%8c%97%e6%af%8d%e8%a6%aa%e7%af%80%e9%a4%90%e5%bb%b3%e5%9a%b4%e9%81%b8%e6%8e%a8%e8%96%a6%ef%bc%8c13%e9%96%93%e5%a5%bd%e8%a9%95%e5%90%8d%e5%ba%97%ef%bc%8c%e7%82%ba%e5%aa%bd%e5%aa%bd%e7%8d%bb/'
    )
    const [name, setName] = useState('母親節')
    const [fields, setFields] = useState<Field[]>([
        { id: 1, type: fieldTypesEnums.parent, selector: '.tag-post-area' },
        { id: 2, type: fieldTypesEnums.title, selector: '.tag-post-title' },
        { id: 3, type: fieldTypesEnums.url, selector: '.tag-post-more > a' },
        { id: 4, type: fieldTypesEnums.img, selector: '.tag-post-img > img' },
    ])
    const [isLoading, setIsLoading] = useState(false)

    const fieldTypes: fieldTypesEnums[] = [
        fieldTypesEnums.title,
        fieldTypesEnums.url,
        fieldTypesEnums.img,
        fieldTypesEnums.time,
        fieldTypesEnums.content,
        fieldTypesEnums.parent,
    ]
    const availableFields = fieldTypes.filter(
        (type) => !fields.find((field) => field.type === type)
    )

    const addField = () => {
        if (fields.length >= 5) return

        const nextType = availableFields[0]
        if (!nextType) return

        setFields([...fields, { id: Date.now(), type: nextType, selector: '' }])
    }

    const removeField = (id: number) => {
        setFields(fields.filter((field) => field.id !== id))
    }

    const updateField = (id: number, key: string, value: any) => {
        setFields(
            fields.map((field) =>
                field.id === id ? { ...field, [key]: value } : field
            )
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url) return

        const selectedFields = fields.filter((field) => {
            if (
                field.type === fieldTypesEnums.title &&
                field.selector.length === 0
            )
                return false
            if (
                field.type === fieldTypesEnums.url &&
                field.selector.length === 0
            )
                return false
            return field.selector.length > 0
        })
        if (selectedFields.length === 0 || selectedFields.length === 1) return

        setIsLoading(true)

        try {
            const result = await scrapeWebsite2({
                url,
                name: name || `${decodeURI(url).slice(0, 30)}...`,
                fields: arrayToObject(selectedFields),
            })

            console.log('查看reulst: ', result)
            sessionStorage.setItem('scrapeResult', JSON.stringify(result))
            router.push('/results')
        } catch (error) {
            console.error('Scraping failed:', error)
            alert(
                'Failed to scrape the website. Please check the URL and selectors.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const checkTitleAndUrlFieldsHasValue = useCallback(() => {
        for (const field of fields) {
            if (
                field.type === fieldTypesEnums.title &&
                field.selector.length === 0
            )
                return true
            if (
                field.type === fieldTypesEnums.url &&
                field.selector.length === 0
            )
                return true
        }
        return false
    }, [fields])

    return (
        <div className="container max-w-3xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">網頁爬蟲設定</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 ">
                            <Label className="" htmlFor="url">
                                網頁URL爬蟲目標
                                <RequiredSignal
                                    weigth={'black'}
                                    className=" ml-2"
                                />
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name"> 🐛🐛名稱 (optional) </Label>
                            <Input
                                id="name"
                                placeholder="My Scrape Project"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Content Selectors (CSS selectors)</Label>
                                {fields.length < 5 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addField}
                                        disabled={availableFields.length === 0}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Field
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {fields.map((field) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="flex grid-cols-5 gap-2 flex-1 w-96">
                                            <div className=" w-32 flex items-center">
                                                <Label>{field.type}</Label>
                                            </div>
                                            <div className="col-span-4 flex w-full">
                                                <Input
                                                    placeholder={`CSS selector for ${field.type}`}
                                                    value={field.selector}
                                                    onChange={(e) =>
                                                        updateField(
                                                            field.id,
                                                            'selector',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {field.type !== 'title' &&
                                            field.type !== 'parent' &&
                                            field.type !== 'url' && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeField(field.id)
                                                    }
                                                >
                                                    <MinusCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <p>
                                Note: At least title and url fields are required
                                for scraping.
                            </p>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={
                            isLoading ||
                            !url ||
                            checkTitleAndUrlFieldsHasValue()
                        }
                    >
                        {isLoading ? 'Scraping...' : 'Start Scraping'}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

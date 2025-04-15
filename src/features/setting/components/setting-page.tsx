'use client'
import type React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, ArrowRight, Trash2, Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { RequiredSignal } from '../../../components/ui/reqireed-icon'
import { scrapeWebsite } from '@/app/actions/scrape-web'
import { arrayToObject } from '@/lib/utils'
import { SettingDialog } from './setting-dialog'
import { Field, fieldTypesEnums } from '../types/form.type'

// 定義爬蟲設定介面
interface ScrapeConfig {
    id: string
    name: string
    url: string
    fields: Field[]
}

export default function SettingPage() {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [configurations, setConfigurations] = useState<ScrapeConfig[]>([])
    const [editingConfig, setEditingConfig] = useState<ScrapeConfig | null>(
        null
    )
    const [isLoading, setIsLoading] = useState(false)

    // 從 sessionStorage 載入設定
    useEffect(() => {
        // 只在客戶端執行
        if (typeof window !== 'undefined') {
            const savedConfigs = sessionStorage.getItem('savedScrapeConfigs')
            if (savedConfigs) {
                try {
                    const parsedConfigs = JSON.parse(savedConfigs)
                    setConfigurations(parsedConfigs)
                } catch (error) {
                    console.error('Error parsing saved configurations:', error)
                }
            }
        }
    }, [])

    // 儲存設定到 sessionStorage
    const saveConfigurations = () => {
        if (configurations.length === 0) {
            alert('沒有可儲存的設定')
            return
        }

        sessionStorage.setItem(
            'savedScrapeConfigs',
            JSON.stringify(configurations)
        )
        alert('設定已儲存！')
    }

    // 處理新增配置
    const handleAddConfig = (config: Omit<ScrapeConfig, 'id'>) => {
        const newConfig = {
            ...config,
            id: Date.now().toString(),
        }
        setConfigurations([...configurations, newConfig])
        setIsDialogOpen(false)
    }

    // 處理編輯配置
    const handleEditConfig = (config: ScrapeConfig) => {
        setEditingConfig(config)
        setIsDialogOpen(true)
    }

    // 處理更新配置
    const handleUpdateConfig = (updatedConfig: ScrapeConfig) => {
        setConfigurations(
            configurations.map((config) =>
                config.id === updatedConfig.id ? updatedConfig : config
            )
        )
        setEditingConfig(null)
        setIsDialogOpen(false)
    }

    // 處理刪除配置
    const handleDeleteConfig = (id: string) => {
        setConfigurations(configurations.filter((config) => config.id !== id))
    }

    // 處理完成設定並前往結果頁面
    const handleFinish = async () => {
        if (configurations.length === 0) return
        setIsLoading(true)

        try {
            // 儲存當前設定
            sessionStorage.setItem(
                'savedScrapeConfigs',
                JSON.stringify(configurations)
            )

            // 對每個配置執行爬蟲
            const results = await Promise.all(
                configurations.map(async (config) => {
                    const result = await scrapeWebsite({
                        url: config.url,
                        name: config.name,
                        fields: arrayToObject(config.fields),
                    })
                    return result
                })
            )

            // 儲存結果到 sessionStorage
            sessionStorage.setItem('scrapeResults', JSON.stringify(results))
            router.push('/results')
        } catch (error) {
            console.error('Scraping failed:', error)
            alert(
                'Failed to scrape the websites. Please check your configurations.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    // 開啟對話框新增配置
    const openAddDialog = () => {
        setEditingConfig(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="container max-w-4xl py-10">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl flex justify-between items-center">
                        <span>網頁爬蟲設定</span>
                        <div className="flex space-x-2">
                            <Button
                                onClick={openAddDialog}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                <Plus className="mr-2 h-4 w-4" /> 新增爬蟲設定
                            </Button>
                            {configurations.length > 0 && (
                                <Button
                                    onClick={saveConfigurations}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    <Save className="mr-2 h-4 w-4" /> 儲存設定
                                </Button>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {configurations.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>尚未新增任何爬蟲設定</p>
                            <Button
                                onClick={openAddDialog}
                                variant="outline"
                                className="mt-4"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                新增第一個爬蟲設定
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {configurations.map((config) => (
                                <Card
                                    key={config.id}
                                    className="p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="w-full flex justify-between items-start">
                                        <div className="w-full">
                                            <h3 className="text-lg font-medium">
                                                {config.name || '未命名設定'}
                                            </h3>
                                            <p className=" text-sm text-gray-500 truncate max-w-md">
                                                {config.url.slice(0, 25) +
                                                    '...'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                已設定{' '}
                                                {
                                                    config.fields.filter(
                                                        (f) => f.selector
                                                    ).length
                                                }{' '}
                                                個選擇器
                                            </p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditConfig(config)
                                                }
                                            >
                                                編輯
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteConfig(
                                                        config.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
                {configurations.length > 0 && (
                    <CardFooter>
                        <Button
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            onClick={handleFinish}
                            disabled={isLoading}
                        >
                            {isLoading ? '處理中...' : '完成設定並獲取結果'}
                            {!isLoading && (
                                <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            <SettingDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSave={handleAddConfig}
                onUpdate={handleUpdateConfig}
                initialData={editingConfig}
            />
        </div>
    )
}

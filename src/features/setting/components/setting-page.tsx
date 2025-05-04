'use client'
import type React from 'react'
import { useState, useCallback, useEffect, useMemo } from 'react'
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
// import { scrapeWebsite , scrapeWebsiteAll} from '@/app/actions/scrape-web'
import { arrayToObject } from '@/lib/utils'
import { SettingDialog } from './setting-dialog'
import { Field, fieldTypesEnums } from '../types/form.type'
import { useSession, signOut } from 'next-auth/react'
import Skeleton from 'react-loading-skeleton'
import { finduser } from '@/app/actions/finduser'
import { ScrapeConfig } from '@/features/setting'
import { updateUserData } from '@/app/actions/updateUserData'
import { ToastProvider, Toast, ToastViewport } from '@/components/ui/toast'
import { useFindUser } from '@/hooks/useFindUser'
import Loading from '@/components/ui/loading'
import { useWebScraper } from '@/hooks/useWebScraper'
import { ScrapeConfigRequest } from '@/features/setting'

// 定義爬蟲設定介面

export default function SettingPage() {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [configurations, setConfigurations] = useState<ScrapeConfig[]>([])
    const [editingConfig, setEditingConfig] = useState<ScrapeConfig | null>(
        null
    )
    const { data: session, status } = useSession()

    const [openToast, setOpenToast] = useState(false)
    const [toastInfo, setToastInfo] = useState('')
    const [isSaveData, setIsSaveData] = useState(false)
    // const [getDbData, setGetDbData] = useState(false)

    const [fetchLoading, setFetchLoading] = useState(false)
    // 確保 useFindUser hook 每次都被調用，即使 session?.user.id 可能是 undefined
    // 這樣可以確保 hooks 的調用順序一致
    const findUserResult = useFindUser(session?.user.id)
    const { data: userData, isLoading, isError } = findUserResult
    console.log('data: ', userData)

    const dataForWebScraper = useMemo<ScrapeConfigRequest[]>(() => {
        return configurations.map((config) => ({
            name: config.name,
            url: config.url,
            fieldsMap: arrayToObject(config.fields),
        }))
    }, [configurations])

    const {
        data: webScraperData,
        isLoading: webScraperLoading,
        refetch: webScraperDataRefetch,
    } = useWebScraper(dataForWebScraper, { enabled: false })

    useEffect(() => {
        findUserResult.refetch()
    }, [session])

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

    useEffect(() => {
        if (session?.user.id) {
            setConfigurations(
                userData && 'scraperDatas' in userData
                    ? userData.scraperDatas
                        ? userData.scraperDatas.map((config) => ({
                              ...config,
                              name: config.name ?? '',
                          }))
                        : []
                    : []
            )
        }
    }, [userData, session])

    // 儲存設定到 sessionStorage
    const saveConfigurations = async () => {
        setIsSaveData(true)
        if (!session?.user.id) {
            setIsSaveData(false)
            return
        }
        const res = await updateUserData({
            userId: session.user.id,
            name: session.user.name ?? '',
            email: session.user.email ?? '',
            data: configurations,
        })

        if (res.code !== 200) {
            setOpenToast(true)
            setIsSaveData(false)
            setToastInfo('儲存失敗,請再試一次')
            // alert('儲存失敗!')
            return
        }
        setOpenToast(true)
        setIsSaveData(false)
        setToastInfo('儲存成功')
        // alert('設定已儲存！')
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
        setFetchLoading(true)
        // console.log('configurations: ', configurations)
        try {
            // 儲存當前設定
            sessionStorage.setItem(
                'savedScrapeConfigs',
                JSON.stringify(configurations)
            )

            await webScraperDataRefetch()
            // 對每個配置執行爬蟲
            // const results = await Promise.all(
            //     configurations.map(async (config) => {
            //         const result = await scrapeWebsite({
            //             url: config.url,
            //             name: config.name,
            //             fieldsMap: arrayToObject(config.fields),
            //         })
            //         return result
            //     })
            // )
            // // 儲存結果到 sessionStorage
            // sessionStorage.setItem('scrapeResults', JSON.stringify(results))
            router.push('/results')
        } catch (error) {
            console.error('Scraping failed:', error)
            alert(
                'Failed to scrape the websites. Please check your configurations.'
            )
        } finally {
            setFetchLoading(false)
        }
    }

    // 開啟對話框新增配置
    const openAddDialog = () => {
        setEditingConfig(null)
        setIsDialogOpen(true)
    }

    // 將 ConfigurationsRender 提取為純函數組件，避免在條件語句中使用 Hooks
    const ConfigurationsRender = () => {
        // 不再在此組件內部使用條件句調用 hooks，而是直接渲染並使用 props 傳遞的值
        if (isLoading || status === 'loading')
            return <Skeleton count={5} width={150} height={30} />

        return (
            <>
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
                                            {config.url.slice(0, 25) + '...'}
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
                                                handleDeleteConfig(config.id)
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
            </>
        )
    }

    // 將所有 hooks 調用移至組件開頭後，再進行條件渲染判斷
    // 這樣可以確保 hooks 調用順序一致

    // 將所有條件渲染放在一起處理
    // 在確保所有 hooks 已經調用後再進行條件跳轉
    // 這樣可以確保 hooks 的調用順序在不同渲染間保持一致
    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="container max-w-4xl py-10">
            <ToastProvider swipeDirection="up">
                <div className=" mb-5">
                    {session && (
                        <div className=" flex justify-between">
                            <Button
                                disabled={isSaveData}
                                onClick={saveConfigurations}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                <Save className="mr-2 h-4 w-4" /> 儲存設定
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    signOut()
                                }}
                            >
                                Sign Out
                            </Button>
                        </div>
                    )}
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between items-center">
                            <span>網頁爬蟲設定</span>

                            {status === 'loading' && (
                                <Skeleton width={200} height={30} />
                            )}
                            {status !== 'loading' && (
                                <div className="flex space-x-2">
                                    {configurations.length > 0 && (
                                        <>
                                            <Button
                                                onClick={openAddDialog}
                                                className="bg-green-500 hover:bg-green-600"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />{' '}
                                                新增爬蟲設定
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ConfigurationsRender />
                    </CardContent>
                    {configurations.length > 0 && (
                        <CardFooter>
                            <Button
                                className="w-full bg-blue-500 hover:bg-blue-600"
                                onClick={handleFinish}
                                disabled={fetchLoading || webScraperLoading}
                            >
                                {fetchLoading || webScraperLoading
                                    ? '處理中...'
                                    : '完成設定並獲取結果'}
                                {!fetchLoading ||
                                    (webScraperLoading && (
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    ))}
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

                <Toast
                    open={openToast}
                    duration={3000}
                    onOpenChange={setOpenToast}
                >
                    {toastInfo}
                </Toast>
                <ToastViewport />
            </ToastProvider>
        </div>
    )
}

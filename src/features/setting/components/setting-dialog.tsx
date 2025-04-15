import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogClose,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Field, fieldTypesEnums } from '../types/form.type'
import { RequiredSignal } from '@/components/ui/reqireed-icon'
import { Button } from '@/components/ui/button'
import { PlusCircle, MinusCircle, ArrowRight } from 'lucide-react'

interface SettingDialogProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSave: (config: { name: string; url: string; fields: Field[] }) => void
    onUpdate?: (config: { id: string; name: string; url: string; fields: Field[] }) => void
    initialData: { id: string; name: string; url: string; fields: Field[] } | null
}

export function SettingDialog({ isOpen, setIsOpen, onSave, onUpdate, initialData }: SettingDialogProps) {
    // 使用初始數據或默認值
    const [url, setUrl] = React.useState(initialData?.url || '')
    const [name, setName] = React.useState(initialData?.name || '')
    const [fields, setFields] = React.useState<Field[]>(initialData?.fields || [
        { id: 1, type: fieldTypesEnums.parent, selector: '' },
        { id: 2, type: fieldTypesEnums.title, selector: '' },
        { id: 3, type: fieldTypesEnums.url, selector: '' },
    ])
    const [isLoading, setIsLoading] = React.useState(false)

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

    // 添加 useEffect 来處理初始數據更新
    React.useEffect(() => {
        if (initialData) {
            setUrl(initialData.url);
            setName(initialData.name);
            setFields(initialData.fields);
        }
    }, [initialData]);

    // 重置表單
    const resetForm = () => {
        setUrl('');
        setName('');
        setFields([
            { id: 1, type: fieldTypesEnums.parent, selector: '' },
            { id: 2, type: fieldTypesEnums.title, selector: '' },
            { id: 3, type: fieldTypesEnums.url, selector: '' },
        ]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) return;

        // 驗證必要欄位
        const selectedFields = fields.filter((field) => {
            if (field.type === fieldTypesEnums.title && field.selector.length === 0)
                return false;
            if (field.type === fieldTypesEnums.url && field.selector.length === 0)
                return false;
            if (field.type === fieldTypesEnums.parent && field.selector.length === 0)
                return false;
            return field.selector.length > 0;
        });

        if (selectedFields.length < 3) {
            alert('至少需要 parent、title 和 url 欄位才能進行爬蚓');
            return;
        }

        setIsLoading(true);
        
        try {
            // 如果是編輯模式
            if (initialData && onUpdate) {
                onUpdate({
                    id: initialData.id,
                    name,
                    url,
                    fields,
                });
            } else {
                // 新增模式
                onSave({
                    name,
                    url,
                    fields,
                });
                resetForm(); // 新增後重置表單
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const checkTitleAndUrlFieldsHasValue = React.useCallback(() => {
        for (const field of fields) {
            if (field.type === fieldTypesEnums.title && field.selector.length === 0)
                return true;
            if (field.type === fieldTypesEnums.url && field.selector.length === 0)
                return true;
            if (field.type === fieldTypesEnums.parent && field.selector.length === 0)
                return true;
        }
        return false;
    }, [fields])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* <DialogTrigger asChild>
                <button className="btn btn-primary">Setting</button>
            </DialogTrigger> */}
            <DialogContent className=" max-w-screen-md">
                <DialogTitle>{initialData ? '編輯爬蚓設定' : '新增爬蚓設定'}</DialogTitle>

                <div className="container max-w-3xl py-10">
                    <Card>
                        {/* <CardHeader>
                            <CardTitle className="text-2xl">
                                網頁爬蟲設定
                            </CardTitle>
                        </CardHeader> */}
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
                                    <Label htmlFor="name">
                                        {' '}
                                        🐛🐛名稱 (optional){' '}
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="My Scrape Project"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>
                                            Content Selectors (CSS selectors)
                                        </Label>
                                        {fields.length < 5 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addField}
                                                disabled={
                                                    availableFields.length === 0
                                                }
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
                                                        <Label>
                                                            {field.type}
                                                        </Label>
                                                    </div>
                                                    <div className="col-span-4 flex w-full">
                                                        <Input
                                                            placeholder={`CSS selector for ${field.type}`}
                                                            value={
                                                                field.selector
                                                            }
                                                            onChange={(e) =>
                                                                updateField(
                                                                    field.id,
                                                                    'selector',
                                                                    e.target
                                                                        .value
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
                                                                removeField(
                                                                    field.id
                                                                )
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
                                        Note: At least title and url fields are
                                        required for scraping.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                取消
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={handleSubmit}
                                disabled={
                                    isLoading ||
                                    !url ||
                                    checkTitleAndUrlFieldsHasValue()
                                }
                            >
                                {isLoading ? '處理中...' : initialData ? '更新設定' : '新增設定'}
                                {!isLoading && (
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

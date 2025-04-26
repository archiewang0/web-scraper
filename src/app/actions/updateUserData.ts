'use server'

import { finduser } from './finduser'
import { register } from './register'
import User from '@/models/user'
import { ScrapeConfig } from '@/features/setting'
// const storage = getStorage();
export async function updateUserData({
    userId,
    name,
    email,
    data,
}: {
    userId: string
    name: string
    email: string
    data: ScrapeConfig[]
}) {
    try {
        const user = await finduser({ userId: userId })

        if (user?.error) {
            // 找不到使用者 新建立user資料
            const userRegistered = await register({
                userId,
                name,
                email,
                scraperDatas: [...data],
            })

            return {
                code: 200,
                message: '使用者註冊成功',
                data: userRegistered,
            }
        }

        if (!user) throw new Error('使用者不存在')
        // 更新預約狀態
        const userUpdated = await User.findByIdAndUpdate(
            user.id,
            {
                scraperDatas: data,
            },
            { new: true }
        )

        if (!userUpdated) {
            throw new Error('更新失敗')
        }

        return {
            code: 200,
            message: '使用者更新成功',
            data: {
                id: userUpdated._id.toString(),
                name: userUpdated.name,
                email: userUpdated.email,
                userId: userUpdated.userId,
                scraperDatas: userUpdated.scraperDatas.map((i) => ({
                    id: i.id,
                    name: i.name,
                    url: i.url,
                    fields: i.fields,
                })),
                createdAt: userUpdated.createdAt?.toISOString(),
                updatedAt: userUpdated.updatedAt?.toISOString(),
            },
        }
    } catch (error) {
        console.error('上傳檔案時發生錯誤：', error)
        return { code: 500, message: error }
    }
}

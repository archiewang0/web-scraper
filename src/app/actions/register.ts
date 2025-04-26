'use server'

import connectDB from '@/lib/mongodb'
import ModelUser from '@/models/user'
import { ScrapeConfig } from '@/features/setting'

export async function register({
    userId,
    name,
    email,
    scraperDatas,
}: {
    userId: string
    name: string
    email: string
    scraperDatas: ScrapeConfig[]
}) {
    await connectDB()

    const userdata = new ModelUser({
        userId,
        name,
        email,
        scraperDatas,
    })

    await userdata.save()

    return {
        id: userdata._id.toString(),
        userId: userdata.userId,
        name: userdata.name,
        email: userdata.email,
        scraperDatas: userdata.scraperDatas,
        createdAt: userdata.createdAt?.toISOString(),
        updatedAt: userdata.updatedAt?.toISOString(),
    }
}

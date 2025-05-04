'use server'

import connectDB from '@/lib/mongodb'
import ModelUser from '@/models/user'
import { IUser, ScraperData } from '@/models/user'

export interface UserRes {
    id: string
    name: string
    email: string
    userId: string
    scraperDatas: ScraperData[]
    createdAt?: string
    updatedAt?: string
}

// export interface ScraperDatas extends {}

export interface ErrorRes {
    error: string
}

export async function finduser({
    userId,
}: {
    userId?: string
}): Promise<UserRes | ErrorRes> {
    if (!userId) {
        return { error: 'User ID is required' }
    }

    await connectDB()
    try {
        const user: IUser | null = await ModelUser.findOne({ userId: userId })

        if (!user) {
            return { error: 'User not found' }
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userId: user.userId,
            scraperDatas: user.scraperDatas.map((data) => ({
                id: data.id,
                name: data.name,
                url: data.url,
                fields: data.fields,
            })),
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
        }
    } catch (error) {
        console.error('Error fetching user:', error)
        return { error: 'User not found' }
    }
}

import {
    Schema,
    model,
    models,
    Document,
    InferSchemaType,
    Model,
} from 'mongoose'
import { Field } from '@/features/setting'

export interface ScraperData extends Document {
    id: string
    name?: string
    url: string
    fields: Field[]
}

const ScraperDataSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: false },
    url: { type: String, required: false },
    fields: { type: Array, required: true },
})

export interface IUser extends Document {
    _id: Schema.Types.ObjectId
    userId: string
    name: string
    email: string
    scraperDatas: ScraperData[]
    createdAt?: Date
    updatedAt?: Date
}

const userSchema = new Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        scraperDatas: {
            type: [ScraperDataSchema],
            default: [],
        },
        // canvasImages: {type: [CanvasSchema], default: []}, // 陣列存放 DrawElement
    },
    {
        timestamps: true,
    }
)

const ModelUser: Model<IUser> = models.User || model<IUser>('User', userSchema)

export default ModelUser

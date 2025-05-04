import { Field, Fields } from './form.type'

interface CommonConfig {
    url: string
    name: string
}

interface ScrapeConfig extends CommonConfig {
    id: string
    fields: Field[]
}

interface ScrapeConfigRequest extends CommonConfig {
    fieldsMap: Fields
}

export type { ScrapeConfig, ScrapeConfigRequest }

import { Field } from './form.type'

interface ScrapeConfig {
    id: string
    name: string
    url: string
    fields: Field[]
}

export type { ScrapeConfig }

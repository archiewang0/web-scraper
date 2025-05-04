enum fieldTypesEnums {
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

type Fields = {
    [key in fieldTypesEnums]?: string
}

export type { Field, Fields }
export { fieldTypesEnums }

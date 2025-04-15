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

export type { Field }
export { fieldTypesEnums }

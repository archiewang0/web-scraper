// src/features/setting/utils/configConverter.ts
import { ScrapeConfig, ScrapeConfigRequest } from './types/scrapeConfig.type'
import { Field, Fields, fieldTypesEnums } from './types/form.type'

/**
 * 將 ScrapeConfig 轉換為 ScrapeConfigRequest
 *
 * 將含有 Field[] 形式的配置轉換為 fieldsMap 結構
 *
 * @param config 前端使用的 ScrapeConfig 物件
 * @returns 適用於 API 的 ScrapeConfigRequest 物件
 */
export function convertToScrapeConfigRequest(
    config: ScrapeConfig
): ScrapeConfigRequest {
    // 創建初始 fieldsMap 物件
    const fieldsMap: Fields = {}

    // 遍歷所有的 fields，並構建 fieldsMap
    for (const field of config.fields) {
        fieldsMap[field.type] = field.selector
    }

    // 返回轉換後的 ScrapeConfigRequest
    return {
        url: config.url,
        name: config.name,
        fieldsMap: fieldsMap,
    }
}

/**
 * 批量轉換多個 ScrapeConfig 到 ScrapeConfigRequest
 *
 * @param configs 前端使用的 ScrapeConfig 物件陣列
 * @returns 適用於 API 的 ScrapeConfigRequest 物件陣列
 */
export function convertMultipleConfigs(
    configs: ScrapeConfig[]
): ScrapeConfigRequest[] {
    return configs.map(convertToScrapeConfigRequest)
}

/**
 * 檢查 ScrapeConfig 是否有效
 *
 * 至少需要包含 parent 和 (title 或 url) 字段
 *
 * @param config 要檢查的配置
 * @returns 該配置是否有效
 */
export function isValidScrapeConfig(config: ScrapeConfig): boolean {
    // 檢查必要字段是否存在
    const hasParentSelector = config.fields.some(
        (field) => field.type === fieldTypesEnums.parent && field.selector
    )

    // 檢查是否至少有一個 title 或 url 選擇器
    const hasTitleOrUrlSelector = config.fields.some(
        (field) =>
            (field.type === fieldTypesEnums.title ||
                field.type === fieldTypesEnums.url) &&
            field.selector
    )

    // 返回配置是否有效
    return Boolean(config.url) && hasParentSelector && hasTitleOrUrlSelector
}

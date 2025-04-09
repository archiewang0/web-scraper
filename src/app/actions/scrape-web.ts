"use server";

import * as cheerio from "cheerio";
import { fieldTypesEnums } from "@/features/setting-page";

interface FieldArr {
  type: fieldTypesEnums;
  selector: string;
}

type Fields = {
  [key in fieldTypesEnums]?: string;
};

interface ScrapeConfig {
  url: string;
  name: string;
  fields: Fields;
}

interface res {
  name: string;
  url: string;
  results: result[];
}
interface result {
  // parent?: string;
  title: string;
  url: string;
  img?: string;
  time?: string;
  content?: string;
}

export async function scrapeWebsite(config: ScrapeConfig): Promise<res> {
  try {
    console.log("run there!!!");
    console.log("check config: ", config);

    // Fetch the HTML content
    const response = await fetch(config.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${config.url}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract data based on the provided selectors
    const results: result[] = [];

    console.log("config.fields.parent: ", config.fields.url);

    $(config.fields.parent).each((_, element) => {
      // 建立一個暫時變數來收集所有欄位
      let data: Fields = {};

      // 處理 url (必須欄位)
      if (config.fields.url) {
        const href = $(element).find(config.fields.url).attr("href");
        data.url = href ? new URL(href, config.url).toString() : "";
      } else {
        // 如果沒有 url 欄位，跳過此項
        return;
      }

      // 處理 title (必須欄位)
      if (config.fields.title) {
        data.title = $(element).find(config.fields.title).text().trim();
      } else {
        // 如果沒有 title 欄位，跳過此項
        return;
      }

      // 處理可選欄位
      if (config.fields.img) {
        const src = $(element).find(config.fields.img).attr("src");
        data.img = src ? new URL(src, config.url).toString() : "";
      }

      if (config.fields.time) {
        data.time = $(element).find(config.fields.time).text().trim();
      }

      if (config.fields.content) {
        data.content = $(element).find(config.fields.content).text().trim();
      }
      
      // 確保 data 符合 result 介面要求
      results.push(data as result);
    });

    // config.fields.forEach((field)=>{
    //   field.type ===
    // })

    // config.fields.forEach((field) => {
    //   $(field.)
    // });

    // Find all potential items (assuming they're in a common container)
    // This is a simplified approach - in a real app, you'd need more sophisticated logic
    // to determine what constitutes an "item" based on the page structure

    // Try to find a common parent for items
    // const commonParents = [
    //   "article",
    //   ".post",
    //   ".item",
    //   ".card",
    //   ".product",
    //   "li",
    //   ".entry",
    //   ".news-item",
    //   ".result",
    // ];

    // let items: cheerio.Cheerio<any> = $();

    // // Try each common parent selector
    // for (const parent of commonParents) {
    //   items = $(parent);
    //   if (items.length > 0) break;
    // }

    // // If no common parent found, just create one result from the whole page
    // if (items.length === 0) {
    //   const result: Record<string, string> = {};

    //   config.fields.forEach((field) => {
    //     if (field.selector) {
    //       if (field.type === "url") {
    //         const href = $(field.selector).attr("href");
    //         result[field.type] = href
    //           ? new URL(href, config.url).toString()
    //           : "";
    //       } else if (field.type === "img") {
    //         result[field.type] = $(field.selector).attr("src") || "";
    //       } else {
    //         result[field.type] = $(field.selector).text().trim();
    //       }
    //     }
    //   });

    //   results.push(result);
    // } else {
    //   // Process each item
    //   items.each((_: any, element: any) => {
    //     const result: Record<string, string> = {};

    //     config.fields.forEach((field) => {
    //       if (field.selector) {
    //         if (field.type === "url") {
    //           const href = $(element).find(field.selector).attr("href");
    //           result[field.type] = href
    //             ? new URL(href, config.url).toString()
    //             : "";
    //         } else if (field.type === "img") {
    //           const src = $(element).find(field.selector).attr("src");
    //           result[field.type] = src
    //             ? new URL(src, config.url).toString()
    //             : "";
    //         } else {
    //           result[field.type] = $(element)
    //             .find(field.selector)
    //             .text()
    //             .trim();
    //         }
    //       }
    //     });

    //     // Only add results that have at least some data
    //     if (Object.values(result).some((val) => val)) {
    //       results.push(result);
    //     }
    //   });
    // }

    return {
      name: config.name,
      url: config.url,
      results,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape website: ${(error as Error).message}`);
  }
}

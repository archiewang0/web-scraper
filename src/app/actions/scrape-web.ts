"use server";

import * as cheerio from "cheerio";

interface Field {
  type: string;
  selector: string;
}

interface ScrapeConfig {
  url: string;
  name: string;
  fields: Field[];
}

export async function scrapeWebsite(config: ScrapeConfig) {
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
    const results = [];

    // Find all potential items (assuming they're in a common container)
    // This is a simplified approach - in a real app, you'd need more sophisticated logic
    // to determine what constitutes an "item" based on the page structure

    // Try to find a common parent for items
    const commonParents = [
      "article",
      ".post",
      ".item",
      ".card",
      ".product",
      "li",
      ".entry",
      ".news-item",
      ".result",
    ];

    let items: cheerio.Cheerio<any> = $();

    // Try each common parent selector
    for (const parent of commonParents) {
      items = $(parent);
      if (items.length > 0) break;
    }

    // If no common parent found, just create one result from the whole page
    if (items.length === 0) {
      const result: Record<string, string> = {};

      config.fields.forEach((field) => {
        if (field.selector) {
          if (field.type === "url") {
            const href = $(field.selector).attr("href");
            result[field.type] = href
              ? new URL(href, config.url).toString()
              : "";
          } else if (field.type === "img") {
            result[field.type] = $(field.selector).attr("src") || "";
          } else {
            result[field.type] = $(field.selector).text().trim();
          }
        }
      });

      results.push(result);
    } else {
      // Process each item
      items.each((_: any, element: any) => {
        const result: Record<string, string> = {};

        config.fields.forEach((field) => {
          if (field.selector) {
            if (field.type === "url") {
              const href = $(element).find(field.selector).attr("href");
              result[field.type] = href
                ? new URL(href, config.url).toString()
                : "";
            } else if (field.type === "img") {
              const src = $(element).find(field.selector).attr("src");
              result[field.type] = src
                ? new URL(src, config.url).toString()
                : "";
            } else {
              result[field.type] = $(element)
                .find(field.selector)
                .text()
                .trim();
            }
          }
        });

        // Only add results that have at least some data
        if (Object.values(result).some((val) => val)) {
          results.push(result);
        }
      });
    }

    return {
      name: config.name,
      url: config.url,
      timestamp: new Date().toISOString(),
      results,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape website: ${(error as Error).message}`);
  }
}

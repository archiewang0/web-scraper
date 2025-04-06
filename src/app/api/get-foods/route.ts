import { NextRequest, NextResponse } from "next/server";
import { CheerioAPI, load } from "cheerio";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("run there!!!");

  let url = "https://nigi33.tw/";
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  let restaurants: any[] = [];
  $(".loop-blog-post article.blog-post ").each((index, element) => {
    const name = $(element).find(" header>h2.title a").text();
    const address = $(element).find("header>h2.title a").attr("href");
    restaurants.push({ name, address });
  });

  return new NextResponse(JSON.stringify(restaurants), { status: 200 });
}

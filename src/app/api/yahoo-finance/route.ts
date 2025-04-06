import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

// 檢查緩存是否有效（24小時內）
function isCacheValid(cacheFile: string): boolean {
  if (!fs.existsSync(cacheFile)) {
    return false;
  }

  const stats = fs.statSync(cacheFile);
  const cacheTime = new Date(stats.mtime).getTime();
  const currentTime = new Date().getTime();
  const cacheAge = (currentTime - cacheTime) / 1000 / 60 / 60; // 小時

  return cacheAge < 24; // 24小時內的緩存有效
}

export async function GET(request: NextRequest) {
  console.log("run GET!!1");

  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
  });

  // try {
  //   const body = await request.json();
  //   const { symbol, interval = '1d', range = '1y' } = body;
  //   if (!symbol) {
  //     return NextResponse.json({ error: '缺少股票代碼參數' }, { status: 400 });
  //   }
  //   // 檢查緩存
  //   const cacheFile = getCacheFileName(symbol, interval, range);
  //   if (isCacheValid(cacheFile)) {
  //     console.log(`使用緩存數據: ${cacheFile}`);
  //     const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  //     return NextResponse.json(cachedData);
  //   }
  //   // 執行Python腳本獲取數據
  //   const scriptPath = path.join(process.cwd(), 'src/lib/api/yahoo_finance.py');
  //   const { stdout, stderr } = await execPromise(`python3 ${scriptPath} ${symbol} ${interval} ${range}`);
  //   if (stderr) {
  //     console.error(`Python腳本錯誤: ${stderr}`);
  //     return NextResponse.json({ error: '獲取數據時出錯' }, { status: 500 });
  //   }
  //   // 解析Python腳本輸出的JSON數據
  //   const data = JSON.parse(stdout);
  //   // 保存到緩存
  //   fs.writeFileSync(cacheFile, JSON.stringify(data));
  //   console.log(`數據已緩存: ${cacheFile}`);
  //   return NextResponse.json(data);
  // } catch (error) {
  //   console.error('API路由處理錯誤:', error);
  //   return NextResponse.json({ error: '處理請求時出錯' }, { status: 500 });
  // }
}

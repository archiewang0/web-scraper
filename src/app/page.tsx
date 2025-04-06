import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Image from "next/image";
import spiderGif from "../../public/spider.gif";
import computerAndSpider from "../../public/computer_spider.png";

export default function Page() {
  // const getFoods = async () => {
  //   const res = await fetch("/api/get-foods");
  //   if (res.status !== 200) {
  //     alert("沒有資料");
  //     return;
  //   }
  //   if (res.status === 200) {
  //     const data = await res.json();
  //     console.log("getfood data: ", data);
  //   }
  // };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="flex flex-col sm:flex-row gap-4">
        <Image src={spiderGif} width={500} height={500} alt="spider" />
        <Image src={computerAndSpider} width={500} height={500} alt="spider" />
        {/* <Image
          src="https://wimg.588ku.com/gif620/21/09/28/924ae8e6b7d2c46ff8154c535ac1b371.gif"
          width={500}
          height={500}
          alt="spider"
        /> */}
        <Link href="/setting">
          <Button
            // onClick={async () => {
            //   const res = await fetch("/api/yahoo-finance");
            //   console.log("res: ", res);
            // }}
            variant="outline"
            size="lg"
            className="px-6"
          >
            設定爬蟲
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        {/* <Button
          onClick={() => {
            getFoods();
          }}
          size="lg"
          className="px-6"
        >
          取得美食資訊
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={async () => {
            const res = await fetch("/api/yahoo-finance");
            console.log("res: ", res);
          }}
          size="lg"
          className="px-6"
        >
          test
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button> */}
      </div>
    </main>
  );
}

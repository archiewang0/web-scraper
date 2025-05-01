import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import Image from 'next/image'
import spiderGif from '../../public/spider.gif'
import computerAndSpider from '../../public/computer_spider.png'

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
            <div className=" text-center">
                <Image
                    src={computerAndSpider}
                    width={500}
                    height={500}
                    alt="spider"
                    priority={true}
                />
                <Link href="/setting">
                    <Button variant="outline" size="lg" className="px-6">
                        設定爬蟲網站
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </main>
    )
}

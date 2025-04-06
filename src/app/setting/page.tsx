import { Metadata } from "next";
import SettingPage from "@/components/page/setting-page";

export const metadata: Metadata = {
  title: "設定爬蟲",
  description: "設定爬蟲對象,以及資料架構,進行爬蟲",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <SettingPage />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ScrapeResult {
  name: string;
  url: string;
  timestamp: string;
  results: Record<string, string>[];
}

export default function ResultsPage() {
  const [scrapeData, setScrapeData] = useState<ScrapeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the scrape result from sessionStorage
    const storedData = sessionStorage.getItem("scrapeResult");
    if (storedData) {
      try {
        setScrapeData(JSON.parse(storedData));
      } catch (error) {
        console.error("Failed to parse scrape data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-10 text-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!scrapeData) {
    return (
      <div className="container max-w-5xl py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">No Scrape Results Found</h2>
              <p>Please configure and run a scrape first.</p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Scraper Configuration
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{scrapeData.name}</h1>
          <p className="text-muted-foreground">
            Scraped from{" "}
            <a
              href={scrapeData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {scrapeData.url}
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(scrapeData.timestamp).toLocaleString()}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Configuration
          </Link>
        </Button>
      </div>

      {scrapeData.results.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>No results found. Try adjusting your selectors.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scrapeData.results.map((item, index) => (
            <Card key={index} className="overflow-hidden flex flex-col">
              {item.img && (
                <div className="relative w-full h-48">
                  <Image
                    src={item.img || "/placeholder.svg"}
                    alt={item.title || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).src =
                        "/placeholder.svg?height=200&width=400";
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {item.title || `Item ${index + 1}`}
                </CardTitle>
                {item.time && (
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                )}
              </CardHeader>
              <CardContent>
                {item.content && (
                  <p className="text-sm line-clamp-3">{item.content}</p>
                )}
              </CardContent>
              <CardFooter className="mt-auto">
                {item.url && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Original
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

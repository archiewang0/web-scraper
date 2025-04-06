"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, MinusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
import { RequiredSignal } from "../ui/reqireed-icon";
import { scrapeWebsite } from "@/app/actions/scrape-web";

enum fieldTypesEnums {
  title = "title",
  url = "url",
  img = "img",
  time = "time",
  content = "content",
}

export default function SettingPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [fields, setFields] = useState([
    { id: 1, type: "title", selector: "" },
    { id: 2, type: "url", selector: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const fieldTypes: fieldTypesEnums[] = [
    fieldTypesEnums.title,
    fieldTypesEnums.url,
    fieldTypesEnums.img,
    fieldTypesEnums.time,
    fieldTypesEnums.content,
  ];
  const availableFields = fieldTypes.filter(
    (type) => !fields.find((field) => field.type === type)
  );

  const addField = () => {
    if (fields.length >= 5) return;

    const nextType = availableFields[0];
    if (!nextType) return;

    setFields([...fields, { id: Date.now(), type: nextType, selector: "" }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: number, key: string, value: any) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) return;

    const selectedFields = fields.filter((field) => {
      if (field.type === fieldTypesEnums.title && field.selector.length === 0)
        return false;
      if (field.type === fieldTypesEnums.url && field.selector.length === 0)
        return false;
      return field.selector.length > 0;
    });
    if (selectedFields.length === 0 || selectedFields.length === 1) return;

    setIsLoading(true);

    try {
      const result = await scrapeWebsite({
        url,
        name: name || "Untitled Scrape",
        fields: selectedFields.map((field) => ({
          type: field.type,
          selector: field.selector,
        })),
      });

      // Store the result in sessionStorage to pass to the results page
      sessionStorage.setItem("scrapeResult", JSON.stringify(result));
      router.push("/results");
    } catch (error) {
      console.error("Scraping failed:", error);
      alert(
        "Failed to scrape the website. Please check the URL and selectors."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkTitleAndUrlFieldsHasValue = useCallback(() => {
    for (const field of fields) {
      if (field.type === fieldTypesEnums.title && field.selector.length === 0)
        return true;
      if (field.type === fieldTypesEnums.url && field.selector.length === 0)
        return true;
    }
    return false;
  }, [fields]);

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">網頁爬蟲設定</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">
                網頁URL爬蟲目標
                <RequiredSignal weigth={"black"} className=" ml-2" />
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name"> 🐛🐛名稱 (optional) </Label>
              <Input
                id="name"
                placeholder="My Scrape Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Content Selectors (CSS selectors)</Label>
                {fields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addField}
                    disabled={availableFields.length === 0}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-3">
                    {/* <Checkbox
                      id={`check-${field.id}`}
                      checked={field.checked}
                      onCheckedChange={(checked) =>
                        updateField(field.id, "checked", checked === true)
                      }
                    /> */}
                    <div className="flex grid-cols-5 gap-2 flex-1 w-96">
                      <div className=" w-32 flex items-center">
                        <Label>{field.type}</Label>
                      </div>
                      <div className="col-span-4 flex w-full">
                        <Input
                          placeholder={`CSS selector for ${field.type}`}
                          value={field.selector}
                          onChange={(e) =>
                            updateField(field.id, "selector", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {field.type !== "title" && field.type !== "url" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field.id)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Note: At least title and url fields are required for scraping.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading || !url || checkTitleAndUrlFieldsHasValue()}
          >
            {isLoading ? "Scraping..." : "Start Scraping"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function arrayToObject(fieldsArray: { type: string; selector: string }[]) {
  const result: Record<string, string> = {};

  fieldsArray.forEach((field) => {
    result[field.type] = field.selector;
  });

  return result;
}

export { arrayToObject };

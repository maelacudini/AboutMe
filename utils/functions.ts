import { twMerge } from "tailwind-merge"
import {
  type ClassValue, clsx 
} from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrlBasedOnServer() {
  // need to include process.env.NEXTAUTH_URL if using this function inside a server side component, no need to include it if using the function inside client side component

  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";

  return baseUrl
}

// eslint-disable-next-line no-unused-vars
type DebouncedFunction<Args extends unknown[]> = (...args: Args) => void;

export const debounce = <Args extends unknown[]>(
  // eslint-disable-next-line no-unused-vars
  mainFunction: (...args: Args) => void,
  delay: number
): DebouncedFunction<Args> => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

export const encodeId = (id: string): string => Buffer.from(id).toString("base64");
export const decodeId = (encodedId: string): string => Buffer.from(encodedId, "base64").toString("utf8");

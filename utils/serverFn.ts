'use server'

import { Locale } from "@/i18n/request";
import { cookies } from "next/headers";
import {
  LOCALE_COOKIE_NAME, defaultLocale 
} from "./constants";
import fs from 'node:fs/promises';
import { getPlaiceholder } from 'plaiceholder';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export async function getLocale(): Promise<Locale> {
  const currentCookies = await cookies()
  const currentLocale = currentCookies.get(LOCALE_COOKIE_NAME)?.value || defaultLocale;  
  
  return currentLocale as Locale
}
  
export async function setLocale(locale: Locale): Promise<void> {
  const currentCookies = await cookies()
  
  currentCookies.set(LOCALE_COOKIE_NAME, locale, { maxAge: 5 });
}
  
export async function generateBlurDataURL(imagePath: string | StaticImport): Promise<string> {
  const buffer = await fs.readFile(`./public/${imagePath}`)
  const { base64 } = await getPlaiceholder(buffer)

  return base64
}
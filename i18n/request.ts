import { getLocale } from '@/utils/serverFn';
import { getRequestConfig } from 'next-intl/server';

export type Locale = 'it' | 'en'
 
export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = await getLocale();
 
    return {
        locale,
        messages: (await import(`./translations/${locale}.json`)).default
    };
});
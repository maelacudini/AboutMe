import { getUserLocale } from '@/utils/server/functions/locale';
import { getRequestConfig } from 'next-intl/server';

export type Locale = 'it' | 'en'
 
export default getRequestConfig(async () => {
    const locale = await getUserLocale();
 
    return {
        locale,
        messages: (await import(`./translations/${locale}.json`)).default
    };
});
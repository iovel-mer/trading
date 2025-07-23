import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  let validLocale: string = locale || 'en';

  if (!locales.includes(validLocale as Locale)) {
    console.error(`Invalid locale received: ${locale}, defaulting to 'en'`);
    validLocale = 'en';
  }

  try {
    const messages = (await import(`./messages/${validLocale}.json`)).default;

    return {
      locale: validLocale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);

    try {
      const fallbackMessages = (await import(`./messages/en.json`)).default;
      return {
        locale: 'en',
        messages: fallbackMessages,
      };
    } catch (fallbackError) {
      console.error('Failed to load fallback messages', fallbackError);
      notFound();
    }
  }
});

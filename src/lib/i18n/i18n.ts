import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{ locale: 'ar', key: '', loader: async () => (await import('./ar.json')).default },
		{ locale: 'cs', key: '', loader: async () => (await import('./cs.json')).default },
		{ locale: 'en', key: '', loader: async () => (await import('./en.json')).default },
		{ locale: 'hu', key: '', loader: async () => (await import('./hu.json')).default },
		{ locale: 'ru', key: '', loader: async () => (await import('./ru.json')).default },
		{ locale: 'zh-Hans', key: '', loader: async () => (await import('./zh-Hans.json')).default },
		{ locale: 'zh-Hant', key: '', loader: async () => (await import('./zh-Hant.json')).default }
	],
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

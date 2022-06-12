import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{ locale: 'en', key: '', loader: async () => (await import('./en.json')).default },
		{ locale: 'ru', key: '', loader: async () => (await import('./ru.json')).default },
		{ locale: 'zh-Hans', key: '', loader: async () => (await import('./zh-Hans.json')).default }
	],
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

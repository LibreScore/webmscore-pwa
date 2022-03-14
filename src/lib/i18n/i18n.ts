import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{
			locale: 'en',
			key: '',
			loader: async () => (await import('./en.json')).default
		},
		{
			locale: 'fr',
			key: '',
			loader: async () => (await import('./fr.json')).default
		},
		{
			locale: 'ar',
			key: '',
			loader: async () => (await import('./ar.json')).default
		},
		{
			locale: 'es',
			key: '',
			loader: async () => (await import('./es.json')).default
		},
		{
			locale: 'it',
			key: '',
			loader: async () => (await import('./it.json')).default
		},
		{
			locale: 'ja',
			key: '',
			loader: async () => (await import('./ja.json')).default
		},
		{
			locale: 'ko',
			key: '',
			loader: async () => (await import('./ko.json')).default
		},
		{
			locale: 'ru',
			key: '',
			loader: async () => (await import('./ru.json')).default
		},
		{
			locale: 'zh-Hans',
			key: '',
			loader: async () => (await import('./zh_Hans.json')).default
		}
	],
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

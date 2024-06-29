import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{ locale: 'ar', key: '', loader: async () => (await import('./ar.json')).default },
		{ locale: 'cs', key: '', loader: async () => (await import('./cs.json')).default },
		{ locale: 'de', key: '', loader: async () => (await import('./de.json')).default },
		{ locale: 'en', key: '', loader: async () => (await import('./en.json')).default },
		{ locale: 'es', key: '', loader: async () => (await import('./es.json')).default },
		{ locale: 'fr', key: '', loader: async () => (await import('./fr.json')).default },
		{ locale: 'hu', key: '', loader: async () => (await import('./hu.json')).default },
		{ locale: 'id', key: '', loader: async () => (await import('./id.json')).default },
		{ locale: 'it', key: '', loader: async () => (await import('./it.json')).default },
		{ locale: 'ja', key: '', loader: async () => (await import('./ja.json')).default },
		{ locale: 'ko', key: '', loader: async () => (await import('./ko.json')).default },
		{ locale: 'ms', key: '', loader: async () => (await import('./ms.json')).default },
		{ locale: 'nl', key: '', loader: async () => (await import('./nl.json')).default },
		{ locale: 'pl', key: '', loader: async () => (await import('./pl.json')).default },
		{ locale: 'pt', key: '', loader: async () => (await import('./pt.json')).default },
		{ locale: 'ru', key: '', loader: async () => (await import('./ru.json')).default },
		{ locale: 'tr', key: '', loader: async () => (await import('./tr.json')).default },
		{ locale: 'zh-Hans', key: '', loader: async () => (await import('./zh-Hans.json')).default },
		{ locale: 'zh-Hant', key: '', loader: async () => (await import('./zh-Hant.json')).default }
	],
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

import { locale } from '$lib/i18n/i18n';
import { languageState } from './stores.js';

export const handle = async ({ event, resolve }) => {
	locale.set($languageState.locale);

	return resolve(event);
};

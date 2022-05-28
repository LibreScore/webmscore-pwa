<script context="module" lang="ts">
	import { loadTranslations } from '$lib/i18n/i18n';

	// Object from language name to locale details.
	let languageMap = { English: ['en', 'ltr'], русский: ['ru', 'ltr'] };

	let locale: string = 'en';
	if (typeof window !== 'undefined') {
		let localeOrder = navigator.languages?.concat(
			Intl.DateTimeFormat().resolvedOptions().locale
		) ?? ['en'];
		let localeArray = Object.values(languageMap).map((arr) => arr[0]);

		localeOrder.some((localeItem) => {
			if (localeArray.includes(localeItem)) {
				locale = localeItem;
				return true;
			} else if (localeArray.includes(localeItem.substring(0, 2))) {
				locale = localeItem.substring(0, 2);
				return true;
			} else if (localeArray.some((locale) => locale.startsWith(localeItem.substring(0, 2)))) {
				locale = localeArray.find((locale) => locale.startsWith(localeItem.substring(0, 2)));
				return true;
			}
		});
		if (locale === 'en') {
			if (
				['ab', 'et', 'kk', 'ky', 'lv', 'os', 'ro-MD', 'ru', 'tg', 'uk', 'uz'].some((e) =>
					localeOrder[0].startsWith(e)
				) &&
				localeArray.includes('ru')
			) {
				locale = 'ru';
			} else {
				locale = 'en';
			}
		}
	}

	let lateUrl;
	export const load = async ({ url }) => {
		const { pathname } = url;
		lateUrl = url;
		await loadTranslations(locale, pathname);

		return {};
	};
</script>

<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import Menu from '@smui/menu';
	import { t } from '$lib/i18n/i18n';
	import type { MenuComponentDev } from '@smui/menu';
	import { Anchor } from '@smui/menu-surface';
	import List, { Item, Text, PrimaryText, SecondaryText } from '@smui/list';

	let menu: MenuComponentDev;
	let anchor: HTMLDivElement;
	let anchorClasses: { [k: string]: boolean } = {};
	let direction = Object.values(languageMap).find((e) => e[0] === locale)?.[1] ?? 'ltr';
	let topAppBar;
	let lightTheme =
		typeof window === 'undefined' || !window.matchMedia('(prefers-color-scheme: light)').matches;
	document.documentElement.setAttribute('lang', locale);

	function switchTheme() {
		let themeLink = document.head.querySelector('#theme');

		if (!themeLink) {
			themeLink = document.createElement('link');
			// @ts-ignore
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}

		// @ts-ignore
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;

		document.head
			.querySelector('link[href="/smui-dark.css"]')
			.insertAdjacentElement('afterend', themeLink);

		document
			.querySelector('meta[name="color-scheme"]')
			.setAttribute('content', lightTheme ? 'light' : 'dark');
	}

	// Object of language options with native keys and localized values.
	let languageItems: { [key: string]: string }[] = [{}];

	function updateLanguages() {
		// Temporary list of language options to alphabetize languageItems.
		languageItems = [{ English: $t('en') }, { русский: $t('ru') }];

		// Sort the languages alphabetically in the current locale
		languageItems.sort((a, b) =>
			Intl.Collator(locale, { sensitivity: 'base' }).compare(
				Object.values(a)[0],
				Object.values(b)[0]
			)
		);
	}

	function updateHtml() {
		document.documentElement.setAttribute('lang', locale);
		document.title = $t('webmscore');
		document.documentElement.setAttribute('dir', direction);
		if (
			new RegExp(
				'[\u0600-\u06FF\u0750-\u077F\u0870-\u089F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0980-\u09FF\u0A80-\u0AFF\u0900-\u097F\uA8E0-\uA8FF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u1780-\u17FF\u19E0-\u19FF\u0C80-\u0CFF\u0D00-\u0D7F\u1000-\u109F\uA9E0-\uA9FF\uAA60-\uAA7F\u0D80-\u0DFF\u0B80-\u0BFF\u0C00-\u0C7F\u0E00-\u0E7F]|\uD83B[\uDE00-\uDEFF]|\uD840[\uDC00-\uFFFF]|[\uD841-\uD868][\u0000-\uFFFF]|\uD869[\u0000-\uDEDF]|\uD869[\uDF00-\uFFFF]|[\uD86A-\uD86C][\u0000-\uFFFF]|\uD86D[\u0000-\uDF3F]|\uD86D[\uDF40-\uFFFF]|\uD86E[\u0000-\uDC1F]|\uD86E[\uDC20-\uFFFF]|[\uD86F-\uD872][\u0000-\uFFFF]|\uD873[\u0000-\uDEAF]|\uD873[\uDEB0-\uFFFF]|[\uD874-\uD879][\u0000-\uFFFF]|\uD87A[\u0000-\uDFEF]|\uD87E[\uDC00-\uDE1F]|\uD880[\uDC00-\uFFFF]|[\uD881-\uD883][\u0000-\uFFFF]|\uD884[\u0000-\uDF4F]|\uD804[\uDDE0-\uDDFF]|\uD807[\uDFC0-\uDFFF]'
			).test(Object.keys(languageMap).find((e) => languageMap[e][0] === locale))
		) {
			document.documentElement.style.fontSize = 'larger';
		} else {
			document.documentElement.style.fontSize = null;
		}
	}

	updateLanguages();
	updateHtml();
</script>

<div>
	<TopAppBar bind:this={topAppBar} variant="standard">
		<Row>
			<Section>
				<Title>{$t('webmscore')}</Title>
			</Section>
			<Section align="end" toolbar>
				<div
					class={Object.keys(anchorClasses).join(' ')}
					use:Anchor={{
						addClass: (className) => {
							if (!anchorClasses[className]) {
								anchorClasses[className] = true;
							}
						},
						removeClass: (className) => {
							if (anchorClasses[className]) {
								delete anchorClasses[className];
								anchorClasses = anchorClasses;
							}
						}
					}}
					bind:this={anchor}
				>
					<IconButton on:click={() => menu.setOpen(true)}>
						<Icon class="material-icons-outlined">language</Icon>
					</IconButton>
					<Menu
						bind:this={menu}
						anchor={false}
						bind:anchorElement={anchor}
						anchorCorner="BOTTOM_START"
						style="max-block-size: 384px"
					>
						<List twoLine>
							{#each languageItems as language}
								<Item
									on:SMUI:action={async () => {
										locale = languageMap[Object.keys(language)[0]][0];
										direction = languageMap[Object.keys(language)[0]][1];
										await loadTranslations(locale, lateUrl);
										updateLanguages();
										updateHtml();
									}}
								>
									<Text>
										<PrimaryText>{Object.keys(language)[0]}</PrimaryText>
										<SecondaryText>{language[Object.keys(language)[0]]}</SecondaryText>
									</Text>
								</Item>
							{/each}
						</List>
					</Menu>
				</div>
				<IconButton on:click={switchTheme} toggle bind:pressed={lightTheme}>
					<Icon class="material-icons-outlined" on>light_mode</Icon>
					<Icon class="material-icons-outlined">dark_mode</Icon>
				</IconButton>
			</Section>
		</Row>
	</TopAppBar>
	<AutoAdjust
		{topAppBar}
		style="display: flex; flex-direction: column; align-items: stretch; margin-inline: 16px; padding-block: 80px 16px;"
		><slot /></AutoAdjust
	>
</div>

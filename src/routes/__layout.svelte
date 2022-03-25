<script context="module" lang="ts">
	import { loadTranslations } from '$lib/i18n/i18n';

	// Object from language name to locale details.
	let languageMap = {
		English: ['en', 'ltr', 'Latn', "'Roboto'"],
		Español: ['es', 'ltr', 'Latn', "'Roboto'"],
		Français: ['fr', 'ltr', 'Latn', "'Roboto'"],
		العربية: ['ar', 'rtl', 'Arab', "'Noto Sans Arabic'"],
		Русский: ['ru', 'ltr', 'Cyrl', "'Roboto'"],
		简体中文: ['zh-Hans', 'ltr', 'Hans', "'Noto Sans SC'"],
		Italiano: ['it', 'ltr', 'Latn', "'Roboto'"],
		日本語: ['ja', 'ltr', 'Jpan', "'Noto Sans JP'"],
		한국어: ['ko', 'ltr', 'Hang', "'Noto Sans KR'"]
	};

	let locale: string = 'en';
	if (typeof window !== 'undefined') {
		let localeOrder = navigator.languages?.concat(
			Intl.DateTimeFormat().resolvedOptions().locale
		) ?? ['en'];

		console.log(localeOrder);
		localeOrder.forEach((localeItem) => {
			console.log(localeItem);
			if ([languageMap].some((e) => localeItem.startsWith(e[0]))) {
				if (/[-_][A-Za-z]{4}/g.test(localeItem)) {
					console.log('passed 1st');
					let tempLocale;
					if (
						[languageMap].some(
							(e) =>
								e[0].startsWith(localeItem.substring(0, 2)) &&
								/[-_][A-Za-z]{4}/g.exec(localeItem).some((f) => {
									tempLocale = f;
									return e[0].includes(f);
								})
						)
					) {
						console.log('passed 2nd');
						locale = tempLocale;
					}
				}
				locale = localeItem.substring(0, 2);
			}
		});
		if (locale === 'en') {
			if (
				['ab', 'et', 'kk', 'ky', 'lv', 'os', 'ro-MD', 'ru', 'tg', 'uk', 'uz'].some((e) =>
					localeOrder[0].startsWith(e)
				)
			) {
				locale = 'ru';
			} else {
				locale = 'en';
			}
		}
		console.log(locale);
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
	let direction = Object.values(languageMap).find((e) => e[0] == locale)?.[1] ?? 'ltr';
	let font = Object.values(languageMap).find((e) => e[0] == locale)?.[3] ?? "'Roboto', sans-serif";
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
	}

	// Object of language options with native keys and localized values.
	let languageItems: { [key: string]: string }[] = [{}];

	function updateLanguages() {
		// Temporary list of language options to alphabetize languageItems.
		languageItems = [
			{ English: $t('englishText') },
			{ Español: $t('spanishText') },
			{ Français: $t('frenchText') },
			{ العربية: $t('arabicText') },
			{ Русский: $t('russianText') },
			{ 简体中文: $t('simplifiedChineseText') },
			{ Italiano: $t('italianText') },
			{ 日本語: $t('japaneseText') },
			{ 한국어: $t('koreanText') }
		];

		// Sort the languages alphabetically in the current locale
		languageItems.sort((a, b) =>
			Intl.Collator(locale, { sensitivity: 'base' }).compare(
				Object.values(a)[0],
				Object.values(b)[0]
			)
		);
	}

	updateLanguages();
</script>

<div dir={direction} style="--mdc-typography-font-family: {font}, sans-serif !important;">
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
						style="block-size: 384px"
					>
						<List twoLine>
							{#each languageItems as language}
								<Item
									on:SMUI:action={async () => {
										locale = languageMap[Object.keys(language)[0]][0];
										document.documentElement.setAttribute('lang', locale);
										direction = languageMap[Object.keys(language)[0]][1];
										font = languageMap[Object.keys(language)[0]][3];
										await loadTranslations(locale, lateUrl);
										updateLanguages();
									}}
								>
									<Text>
										<PrimaryText
											style="font-family: {languageMap[Object.keys(language)[0]][3]} !important;"
											>{Object.keys(language)[0]}</PrimaryText
										>
										<SecondaryText>{language[Object.keys(language)[0]]}</SecondaryText>
									</Text>
								</Item>
							{/each}
						</List>
					</Menu>
				</div>
				<!-- <div>
				<Select
					on:click={async () => {
						await loadTranslations(locale, lateUrl);
						updateLanguages();
					}}
					variant="outlined"
					bind:value={locale}
					label={$t('language')}
				>
					<Icon class="material-icons-outlined" slot="leadingIcon">language</Icon>
					{#each languageItems as language}
						<Option value={languageMap[Object.keys(language)[0]]}>{Object.keys(language)[0]}</Option
						>
					{/each}
				</Select>
			</div> -->
				<IconButton on:click={switchTheme} toggle bind:pressed={lightTheme}>
					<Icon class="material-icons-outlined" on>light_mode</Icon>
					<Icon class="material-icons-outlined">dark_mode</Icon>
				</IconButton>
			</Section>
		</Row>
	</TopAppBar>
	<AutoAdjust
		{topAppBar}
		style="display: flex; flex-direction: column; align-items: stretch; margin-inline: 16px; margin-block: 0px 16px; padding-block-start: 80px;"
		><slot /></AutoAdjust
	>
</div>

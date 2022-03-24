<script context="module" lang="ts">
	import { loadTranslations } from '$lib/i18n/i18n';

	let locale =
		// Intl.DateTimeFormat().resolvedOptions().locale ||
		'en';

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
	let direction = 'ltr';
	let font = "'Roboto', sans-serif";
	let topAppBar;
	let lightTheme =
		typeof window === 'undefined' || !window.matchMedia('(prefers-color-scheme: light)').matches;

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

	// Object from language name to locale details.
	let languageMap = {
		English: ['en', 'ltr', 'Latn', "'Roboto', sans-serif"],
		Español: ['es', 'ltr', 'Latn', "'Roboto', sans-serif"],
		Français: ['fr', 'ltr', 'Latn', "'Roboto', sans-serif"],
		العربية: ['ar', 'rtl', 'Arab', "'Noto Sans Arabic', sans-serif"],
		Русский: ['ru', 'ltr', 'Cyrl', "'Roboto', sans-serif"],
		简体中文: ['zh-Hans', 'ltr', 'Hans', "'Noto Sans SC', sans-serif"],
		Italiano: ['it', 'ltr', 'Latn', "'Roboto', sans-serif"],
		日本語: ['ja', 'ltr', 'Jpan', "'Noto Sans JP', sans-serif"],
		한국어: ['ko', 'ltr', 'Hang', "'Noto Sans KR', sans-serif"]
	};
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

<div dir={direction} style="--mdc-typography-font-family: {font} !important;">
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
										direction = languageMap[Object.keys(language)[0]][1];
										font = languageMap[Object.keys(language)[0]][3];
										await loadTranslations(locale, lateUrl);
										updateLanguages();
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

<script context="module">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import { loadTranslations, t } from '$lib/i18n/i18n';
	import Select, { Option } from '@smui/select';

	let initLocale =
		// Intl.DateTimeFormat().resolvedOptions().locale ||
		'en';
	let lateUrl;
	export const load = async ({ url }) => {
		const { pathname } = url;
		lateUrl = url;
		await loadTranslations(initLocale, pathname);

		return {};
	};

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

	let languages = ['en', 'fr', 'ar', 'es', 'it', 'ja', 'ko', 'ru', 'zh-Hans'];
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<Title>{$t('webmscore')}</Title>
		</Section>
		<Section align="end" toolbar>
			<Select
				on:click={() => loadTranslations(initLocale, lateUrl)}
				variant="outlined"
				bind:value={initLocale}
				label={$t('language')}
			>
				{#each languages as language}
					<Option value={language}>{language}</Option>
				{/each}
			</Select>
			<IconButton on:click={switchTheme} toggle bind:pressed={lightTheme}>
				<Icon class="material-icons-outlined" on>light_mode</Icon>
				<Icon class="material-icons-outlined">dark_mode</Icon>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust
	{topAppBar}
	style="display: flex; flex-direction: column; align-items: stretch; margin: 0px 16px 16px 16px; padding-block-start: 80px;"
	><slot /></AutoAdjust
>

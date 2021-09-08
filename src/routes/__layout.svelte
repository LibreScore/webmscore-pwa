<script>
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';

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
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<Title>Webmscore</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton on:click={switchTheme} toggle bind:pressed={lightTheme}>
				<Icon class="material-icons-outlined" on>light_mode</Icon>
				<Icon class="material-icons-outlined">dark_mode</Icon>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar} style="margin: 0px 16px 16px 16px; padding-block-start: 80px;"
	><slot /></AutoAdjust
>

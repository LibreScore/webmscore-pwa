<script>
	import { exportOptions, homeState } from '../stores.js';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import { t } from '$lib/i18n/i18n';

	let options = [$t('draw_page_background_option'), $t('png_transparent_background_option')];
	$: options = [$t('draw_page_background_option'), $t('png_transparent_background_option')];
	let selected = [
		$exportOptions.drawPageBackground ? $t('draw_page_background_option') : null,
		$exportOptions.transparent ? $t('png_transparent_background_option') : null
	];

	function setOptions() {
		$exportOptions.drawPageBackground = selected.includes($t('draw_page_background_option'));
		$exportOptions.transparent = selected.includes($t('png_transparent_background_option'));
		$homeState.convertIsDisabled = false;
		$homeState.downloadIsDisabled = true;
	}
</script>

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">{$t('png_note')}</p>

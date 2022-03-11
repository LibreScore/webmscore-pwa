<script>
	import { exportOptions } from '../stores.js';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import { t } from '$lib/i18n/i18n';

	$: options = [$t('draw_page_background_option'), $t('png_transparent_background_option')];
	$: selected = options.map((n) => n);

	function setOptions() {
		$exportOptions.drawPageBackground = selected.includes($t('draw_page_background_option'));
		$exportOptions.transparent = selected.includes($t('png_transparent_background_option'));
	}
</script>

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">{$t('png_note')}</p>

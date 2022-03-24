<script>
	import { exportOptions, homeState } from '../stores.js';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import { t } from '$lib/i18n/i18n';

	let options = [$t('midi_expand_repeats_option'), $t('midi_export_rpns_option')];
	$: options = [$t('midi_expand_repeats_option'), $t('midi_export_rpns_option')];
	let selected = [
		$exportOptions.midiExpandRepeats ? $t('midi_expand_repeats_option') : null,
		$exportOptions.exportRPNs ? $t('midi_export_rpns_option') : null
	];

	function setOptions() {
		$exportOptions.midiExpandRepeats = selected.includes($t('midi_expand_repeats_option'));
		$exportOptions.exportRPNs = selected.includes($t('midi_export_rpns_option'));
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

<p class="mdc-typography--body2">{$t('midi_note')}</p>

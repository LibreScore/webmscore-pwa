<script>
	import { exportOptions } from '../stores.js';
	import Select, { Option } from '@smui/select';
	import { t } from '$lib/i18n/i18n';

	$: options = [$t('mxl_option'), $t('musicxml_option'), $t('xml_option')];
	$: selectedOption = $t('mxl_option');

	function setOptions() {
		if (selectedOption === $t('mxl_option')) {
			$exportOptions.compress = true;
		} else {
			$exportOptions.compress = false;
		}
	}
</script>

<Select
	variant="outlined"
	bind:value={selectedOption}
	on:click={setOptions}
	label={$t('musicxml_filetype_label')}
	required
>
	{#each options as option}
		<Option value={option}>{option}</Option>
	{/each}
</Select>

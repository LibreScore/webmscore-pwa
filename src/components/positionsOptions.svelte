<script>
	import { exportOptions } from '../stores.js';
	import Select, { Option } from '@smui/select';
	import { t } from '$lib/i18n/i18n';

	$: options = [$t('positions_measures_option'), $t('positions_segments_option')];
	$: selectedOption = $t('positions_measures_option');

	function setOptions() {
		if (selectedOption === $t('positions_segments_option')) {
			$exportOptions.ofSegments = true;
		} else {
			$exportOptions.ofSegments = false;
		}
	}
</script>

<Select
	variant="outlined"
	bind:value={selectedOption}
	on:click={setOptions}
	label={$t('positions_of_label')}
	required
>
	{#each options as option}
		<Option value={option}>{option}</Option>
	{/each}
</Select>

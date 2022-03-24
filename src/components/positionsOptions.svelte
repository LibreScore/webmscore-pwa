<script>
	import { exportOptions, homeState } from '../stores.js';
	import Select, { Option } from '@smui/select';
	import { t } from '$lib/i18n/i18n';

	let options = [$t('positions_measures_option'), $t('positions_segments_option')];
	$: options = [$t('positions_measures_option'), $t('positions_segments_option')];
	let selectedOption = $exportOptions.ofSegments
		? $t('positions_measures_option')
		: $t('positions_measures_option');
	let oldSelectedOption = selectedOption;

	function setOptions() {
		if (selectedOption === $t('positions_segments_option')) {
			$exportOptions.ofSegments = true;
		} else {
			$exportOptions.ofSegments = false;
		}
		if (oldSelectedOption !== selectedOption) {
			$homeState.convertIsDisabled = false;
			$homeState.downloadIsDisabled = true;
		}
		oldSelectedOption = selectedOption;
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

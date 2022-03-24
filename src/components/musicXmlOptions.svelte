<script>
	import { exportOptions, homeState } from '../stores.js';
	import Select, { Option } from '@smui/select';
	import { t } from '$lib/i18n/i18n';

	let options = [$t('mxl_option'), $t('musicxml_option'), $t('xml_option')];
	$: options = [$t('mxl_option'), $t('musicxml_option'), $t('xml_option')];
	let selectedOption = $exportOptions.compress
		? $t('mxl_option')
		: $exportOptions.outdated
		? $t('xml_option')
		: $t('musicxml_option');
	let oldSelectedOption = selectedOption;

	function setOptions() {
		if (selectedOption === $t('mxl_option')) {
			$exportOptions.compress = true;
		} else {
			if (selectedOption === $t('xml_option')) {
				$exportOptions.outdated = true;
			} else {
				$exportOptions.outdated = false;
			}
			$exportOptions.compress = false;
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
	label={$t('musicxml_filetype_label')}
	required
>
	{#each options as option}
		<Option value={option}>{option}</Option>
	{/each}
</Select>

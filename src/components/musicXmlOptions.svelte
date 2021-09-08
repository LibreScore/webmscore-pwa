<script>
	import { exportOptions } from '../stores.js';
	import Select, { Option } from '@smui/select';

	let options = [
		'Compressed (*.mxl)',
		'Uncompressed (*.musicxml)',
		'Uncompressed (outdated) (*.xml)'
	];
	let selectedOption = 'Compressed (*.mxl)';

	function setOptions() {
		if (selectedOption === 'Compressed (*.mxl)') {
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
	label="MusicXML file type"
	required
>
	{#each options as option}
		<Option value={option}>{option}</Option>
	{/each}
</Select>

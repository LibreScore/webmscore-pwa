<script>
	import { exportOptions } from '../stores.js';
	import Select, { Option } from '@smui/select';

	let options = ['Measures', 'Segments'];
	let selectedOption = 'Measures';

	function setOptions() {
		if (selectedOption === 'Segments') {
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
	label="Positions of"
	required
>
	{#each options as option}
		<Option value={option}>{option}</Option>
	{/each}
</Select>

<script>
	import { exportOptions } from '../stores.js';
	import Textfield from '@smui/textfield';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Select, { Option } from '@smui/select';
	import Slider from '@smui/slider';

	// export let sliderIsDisabled = true;

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

<!-- <Textfield
		bind:value={valueDPI}
		bind:invalid={invalidDPI}
		on:change={checkDPI}
		variant="outlined"
		label="Resolution"
		type="number"
		suffix="DPI"
		input$min="32"
		input$max="5000"
	/> -->

<!-- <FormField align="end">
		<Slider
			style="flex-grow: 1;"
			range
			bind:start={minUpdate}
			bind:end={npages}
			bind:disabled={sliderIsDisabled}
			min={0}
			max={npages}
			step={1}
			discrete
			tickMarks
			input$aria-label="Range slider"
		/>
		<span slot="label">Pages</span>
	</FormField> -->

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

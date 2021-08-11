<script>
	import { exportOptions } from '../stores.js';
	import Textfield from '@smui/textfield';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Slider from '@smui/slider';

	export let npages = 1;
	export let minUpdate = 1;
	let invalidPageNumber = false;
	// function checkPageNumber() {
	// 	if (1 > $exportOptions.pageNumber || $exportOptions.pageNumber > npages) {
	// 		invalidPageNumber = true;
	// 	} else {
	// 		invalidPageNumber = false;
	// 	}
	// }
	// export let sliderIsDisabled = true;

	let options = ['Draw page background', 'Transparent background'];
	let selected = options.map((n) => n);

	function setOptions() {
		$exportOptions.drawPageBackground = selected.includes('Draw page background');
		$exportOptions.transparent = selected.includes('Transparent background');
	}

	let valueStart = minUpdate;
	let valueEnd = npages;
	let minPages = minUpdate;
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

<!-- <Textfield
	bind:value={$exportOptions.pageNumber}
	bind:invalid={invalidPageNumber}
	on:change={checkPageNumber}
	variant="outlined"
	label="Page number"
	type="number"
	input$min="1"
	input$max={npages}
/> -->

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">
	Each page of the selected scores will be exported as a separate PNG file.
</p>

<script>
	import { exportOptions } from '../stores.js';
	import Textfield from '@smui/textfield';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Slider from '@smui/slider';

	// export let sliderIsDisabled = true;

	let options = ['Expand repeats', 'Export RPNs'];
	let selected = options.map((n) => n);

	function setOptions() {
		$exportOptions.midiExpandRepeats = selected.includes('Expand repeats');
		$exportOptions.exportRPNs = selected.includes('Export RPNs');
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

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">Each selected score will be exported as a separate MIDI file.</p>

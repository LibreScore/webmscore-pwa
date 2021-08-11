<script>
	import Textfield from '@smui/textfield';
	import Radio from '@smui/radio';
	import FormField from '@smui/form-field';

	let valueDPI = 360;
	let invalidDPI = false;
	function checkDPI() {
		if (75 > valueDPI || valueDPI > 2400) {
			invalidDPI = true;
		} else {
			invalidDPI = false;
		}
	}

	let options = ['Export each score as a separate file', 'All scores combined into one file'];

	let selected = options[0];
</script>

<!-- <Textfield
		bind:value={valueDPI}
		bind:invalid={invalidDPI}
		on:change={checkDPI}
		variant="outlined"
		label="Resolution"
		type="number"
		suffix="DPI"
		input$min="75"
		input$max="2400"
	/>

	{#each options as option}
		<FormField>
			<Radio bind:group={selected} value={option} />
			<span slot="label">{option}</span>
		</FormField>
	{/each} -->

<p class="mdc-typography--body2">No options.</p>

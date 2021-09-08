<script>
	import { exportOptions } from '../stores.js';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';

	let options = ['Draw page background', 'Transparent background'];
	let selected = options.map((n) => n);

	function setOptions() {
		$exportOptions.drawPageBackground = selected.includes('Draw page background');
		$exportOptions.transparent = selected.includes('Transparent background');
	}
</script>

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">
	Each page of the selected scores will be exported as a separate PNG file.
</p>

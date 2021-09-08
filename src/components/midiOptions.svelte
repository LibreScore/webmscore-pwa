<script>
	import { exportOptions } from '../stores.js';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';

	let options = ['Expand repeats', 'Export RPNs'];
	let selected = options.map((n) => n);

	function setOptions() {
		$exportOptions.midiExpandRepeats = selected.includes('Expand repeats');
		$exportOptions.exportRPNs = selected.includes('Export RPNs');
	}
</script>

{#each options as option}
	<FormField>
		<Checkbox on:change={setOptions} bind:group={selected} value={option} />
		<span slot="label">{option}</span>
	</FormField>
{/each}

<p class="mdc-typography--body2">Each selected score will be exported as a separate MIDI file.</p>

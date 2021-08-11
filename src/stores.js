import { writable } from 'svelte/store';

export const exportOptions = writable({
	// pageNumber: 1,
	drawPageBackground: true,
	transparent: true,
	midiExpandRepeats: true,
	exportRPNs: true,
	compress: true,
	ofSegments: false
});

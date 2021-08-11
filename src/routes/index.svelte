<script lang="typescript">
	import { exportOptions } from '../stores.js';
	import Button, { Group, Label, Icon } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import List, { Item, Text, Meta } from '@smui/list';
	import Checkbox from '@smui/checkbox';
	import Card, { Content } from '@smui/card';
	import CircularProgress from '@smui/circular-progress';
	import LinearProgress from '@smui/linear-progress';
	import Snackbar, { Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { fileOpen, directoryOpen, fileSave, supported } from 'browser-fs-access';
	import JSZip, { prototype } from 'jszip';
	import PdfOptions from '../components/pdfOptions.svelte';
	import PngOptions from '../components/pngOptions.svelte';
	import SvgOptions from '../components/svgOptions.svelte';
	import Mp3Options from '../components/mp3Options.svelte';
	import WavOptions from '../components/wavOptions.svelte';
	import FlacOptions from '../components/flacOptions.svelte';
	import OggOptions from '../components/oggOptions.svelte';
	import MidiOptions from '../components/midiOptions.svelte';
	import MusicXmlOptions from '../components/musicXmlOptions.svelte';
	import MsczOptions from '../components/msczOptions.svelte';
	import MscxOptions from '../components/mscxOptions.svelte';
	import PositionsOptions from '../components/positionsOptions.svelte';
	import MetadataOptions from '../components/metadataOptions.svelte';
	import WebMscore from 'webmscore';

	let score: WebMscore;
	let title;
	let blob: Blob = new Blob();
	let zip = new JSZip();
	//@ts-ignore
	let blobs: FileWithHandle = blob;
	//@ts-ignore
	let oldBlobs: FileWithHandle;
	let msczMetadata = 'No file metadata.';
	let fileName = 'No file loaded.';
	let errorMessage = 'Unknown error.';
	let scoreLoaded = false;
	let npages = 1;
	let progress = 0;
	let minUpdate = 0;
	let sliderIsDisabled = true;
	let loadingSnackbar;
	let convertingSnackbar;
	let exportType = 'PDF';
	let exportTypes = [
		'PDF',
		'PNG',
		'SVG',
		'MP3',
		'WAV',
		'FLAC',
		'OGG',
		'MIDI',
		'MusicXML',
		'MSCZ',
		'MSCX',
		'Positions',
		'Metadata'
	];

	let items = [
		{
			id: -1,
			parts: [
				{
					harmonyCount: 0,
					hasDrumStaff: '',
					hasPitchedStaff: '',
					hasTabStaff: '',
					instrumentId: '',
					instrumentName: '',
					isVisible: '',
					lyricCount: 0,
					name: '',
					program: 0
				}
			],
			title: 'Full Score'
		}
	];
	let selected = [items[items.findIndex((part) => part.id === -1)].id];
	let convertIsDisabled = true;
	let downloadIsDisabled = true;
	let optionsAreDisabled = true;
	let fileIsLoading = false;
	let convertIsProcessing = false;
	let isZipping = false;

	function updateConvertDisabled() {
		if (
			blobs.size !== 0 &&
			exportType != '' &&
			selected.length !== 0 &&
			exportTypes.includes(exportType) &&
			!fileIsLoading
		) {
			convertIsDisabled = false;
			optionsAreDisabled = false;
		} else {
			convertIsDisabled = true;
		}
		downloadIsDisabled = true;
	}

	//@ts-ignore
	$: selected, updateConvertDisabled();

	function selectAll() {
		selected = items.map((item) => item.id);
	}

	function clearSelection() {
		selected = [];
	}

	async function handleMscz() {
		convertIsDisabled = true;
		//@ts-ignore
		blobs = await fileOpen([
			{
				mimeTypes: [
					'application/x-musescore',
					'application/x-musescore+xml',
					'application/vnd.recordare.musicxml',
					'application/vnd.recordare.musicxml+xml',
					// 'audio/midi',
					'audio/x-gtp',
					'audio/x-ptb'
				],
				extensions: [
					'.mscz',
					'.mscx',
					'.mxl',
					'.musicxml',
					'.xml',
					// '.mid',
					// '.midi',
					// '.kar',
					'.gtp',
					'.gp3',
					'.gp4',
					'.gp5',
					'.gpx',
					'.gp',
					'.ptb'
				],
				description: 'All Supported Files',
				id: 'uploads'
			},
			{
				mimeTypes: ['application/x-musescore', 'application/x-musescore+xml'],
				extensions: ['.mscz', '.mscx'],
				description: 'MuseScore Files'
			},
			{
				mimeTypes: ['application/vnd.recordare.musicxml', 'application/vnd.recordare.musicxml+xml'],
				extensions: ['.mxl', '.musicxml', '.xml'],
				description: 'MusicXML Files'
			},
			// {
			// 	mimeTypes: ['audio/midi'],
			// 	extensions: ['.mid', '.midi', '.kar'],
			// 	description: 'MIDI Files'
			// },
			// {
			// 	mimeTypes: ['application/x-musedata'],
			// 	extensions: ['.md'],
			// 	description: 'MuseData Files'
			// },
			// {
			// 	mimeTypes: ['application/x-capella'],
			// 	extensions: ['.cap', '.capx'],
			// 	description: 'Capella Files'
			// },
			// {
			// 	mimeTypes: ['application/x-biab'],
			// 	extensions: ['.mgu', '.sgu'],
			// 	description: 'BB Files (experimental)'
			// },
			// {
			// 	mimeTypes: ['application/x-overture'],
			// 	extensions: ['.ove', '.scw'],
			// 	description: 'Overture / Score Writer Files (experimental)'
			// },
			// {
			// 	mimeTypes: ['application/x-bww'],
			// 	extensions: ['.bmw', '.bww'],
			// 	description: 'Bagpipe Music Writer Files (experimental)'
			// },
			{
				mimeTypes: ['audio/x-gtp'],
				extensions: ['.gtp', '.gp3', '.gp4', '.gp5', '.gpx', '.gp'],
				description: 'Guitar Pro Files'
			},
			{
				mimeTypes: ['audio/x-ptb'],
				extensions: ['.ptb'],
				description: 'Power Tab Editor Files (experimental)'
			}
			// {
			// 	mimeTypes: ['application/x-musescore', 'application/x-musescore+xml'],
			// 	extensions: ['.mscz,', '.mscx,'],
			// 	description: 'MuseScore Backup Files'
			// }
		]).catch(() => {
			convertIsDisabled = false;
			return oldBlobs;
		});

		if (oldBlobs === blobs) {
			return;
		}

		oldBlobs = blobs;

		let fileExt = blobs.name.substring(blobs.name.lastIndexOf('.') + 1);
		if (fileExt === 'mid') {
			fileExt = 'midi';
		}
		if (
			![
				'gp',
				'gp3',
				'gp4',
				'gp5',
				'gpx',
				'gtp',
				'kar',
				'midi',
				'mscx',
				'mscz',
				'musicxml',
				'mxl',
				'ptb',
				'xml'
			].includes(fileExt)
		) {
			errorMessage = 'Invalid file extension.';
			loadingSnackbar.open();
			return;
		}

		fileName = blobs.name;
		if (scoreLoaded) {
			score.destroy();
		}

		WebMscore.ready.then(async () => {
			fileIsLoading = true;
			score = await WebMscore.load(fileExt, new Uint8Array(await blobs.arrayBuffer())).then(
				async (loaded) => {
					await loaded.setSoundFont(
						new Uint8Array(
							await (
								await fetch(
									'https://cdn.jsdelivr.net/gh/musescore/MuseScore@2.1/share/sound/FluidR3Mono_GM.sf3'
								)
							).arrayBuffer()
						)
					);
					await loaded.generateExcerpts();
					await loaded.metadata().then(async (meta) => {
						msczMetadata = JSON.stringify(meta);
						items = [items[0]];
						meta.excerpts.forEach((part) => items.push(part));
					});
					title = await loaded.title();
					npages = await loaded.npages();
					fileIsLoading = false;
					minUpdate = 1;
					sliderIsDisabled = false;
					return loaded;
				}
			);
			if (exportType !== '') {
				convertIsDisabled = false;
				optionsAreDisabled = false;
				scoreLoaded = true;
			} else {
				convertIsDisabled = true;
			}
		});
	}

	async function saveFile() {
		let fileExtension = '.';
		let partsLength = selected.length;
		let partsPages: number[] = [];
		convertIsDisabled = true;
		downloadIsDisabled = true;
		convertIsProcessing = true;
		isZipping = false;
		progress = 0;
		zip = new JSZip();

		if (exportType === 'PNG' || exportType == 'SVG') {
			selected.forEach(async (excerptId, index) => {
				score.setExcerptId(excerptId);
				partsPages.push(await score.npages());

				if (index === partsLength - 1) {
					let pagesLength = partsPages.reduce((a, b) => a + b, 0);

					selected.forEach(async (excerptIdNew, indexNew) => {
						score.setExcerptId(excerptIdNew);
						[...Array(partsPages[indexNew]).keys()].forEach(async (_, i) => {
							if (exportType === 'PNG') {
								blob = await new Blob(
									[
										await (
											await score.savePng(
												i,
												$exportOptions.drawPageBackground,
												$exportOptions.transparent
											)
										).buffer
									],
									{
										type: 'image/png'
									}
								);
								fileExtension = '.png';
							} else if (exportType === 'SVG') {
								blob = await new Blob([await score.saveSvg(i, $exportOptions.drawPageBackground)], {
									type: 'image/svg+xml'
								});
								fileExtension = '.svg';
							}

							if (blob.size != 0) {
								let fileSuffix =
									'-' +
									items[items.findIndex((part) => part.id === excerptIdNew)].title +
									'-' +
									(i + 1).toString();
								if (excerptIdNew == -1) {
									fileSuffix = '-' + (i + 1).toString();
								}
								zip.file(
									fileName.substring(0, fileName.lastIndexOf('.')) + fileSuffix + fileExtension,
									blob
								);
								progress += 1 / pagesLength;
							}

							if (indexNew === partsLength - 1 && i === partsPages[indexNew] - 1) {
								progress = 1;
								isZipping = true;
								blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
									downloadIsDisabled = false;
									convertIsProcessing = false;
									return zipped;
								});
							}
						});
					});
				}
			});
		} else {
			selected.forEach(async (excerptId, index) => {
				score.setExcerptId(excerptId);
				switch (exportType) {
					case 'PDF':
						blob = await new Blob([await (await score.savePdf()).buffer], {
							type: 'application/pdf'
						});
						fileExtension = '.pdf';
						break;
					case 'MP3':
						blob = await new Blob([await (await score.saveAudio('mp3')).buffer], {
							type: 'audio/mpeg'
						});
						fileExtension = '.mp3';
						break;
					case 'WAV':
						blob = await new Blob([await (await score.saveAudio('wav')).buffer], {
							type: 'audio/vnd.wave'
						});
						fileExtension = '.wav';
						break;
					case 'FLAC':
						blob = await new Blob([await (await score.saveAudio('flac')).buffer], {
							type: 'audio/flac'
						});
						fileExtension = '.flac';
						break;
					case 'OGG':
						blob = await new Blob([await (await score.saveAudio('ogg')).buffer], {
							type: 'audio/ogg'
						});
						fileExtension = '.ogg';
						break;
					case 'MIDI':
						blob = await new Blob(
							[
								await (
									await score.saveMidi($exportOptions.midiExpandRepeats, $exportOptions.exportRPNs)
								).buffer
							],
							{
								type: 'audio/midi'
							}
						);
						fileExtension = '.mid';
						break;
					case 'MusicXML':
						if ($exportOptions.compress) {
							blob = await new Blob([await (await score.saveMxl()).buffer], {
								type: 'application/vnd.recordare.musicxml'
							});
							fileExtension = '.mxl';
						} else {
							blob = await new Blob([await await score.saveXml()], {
								type: 'application/vnd.recordare.musicxml+xml'
							});
							fileExtension = '.musicxml';
						}
						break;
					case 'MSCZ':
						blob = await new Blob([await (await score.saveMsc('mscz')).buffer], {
							type: 'application/x-musescore'
						});
						fileExtension = '.mscz';
						break;
					case 'MSCX':
						blob = await new Blob([await (await score.saveMsc('mscx')).buffer], {
							type: 'application/x-musescore+xml'
						});
						fileExtension = '.mscx';
						break;
					case 'Positions':
						blob = await new Blob([await await score.savePositions($exportOptions.ofSegments)], {
							type: 'application/json'
						});
						fileExtension = '.json';
						break;
					case 'Metadata':
						blob = await new Blob([await await score.saveMetadata()], {
							type: 'application/json'
						});
						fileExtension = '.json';
						break;
					default:
						blob = new Blob();
						errorMessage = 'Invalid export target.';
						loadingSnackbar.open();
						return;
				}

				if (blob.size != 0) {
					let fileSuffix = '-' + items[items.findIndex((part) => part.id === excerptId)].title;
					if (excerptId == -1) {
						fileSuffix = '';
					}
					zip.file(
						fileName.substring(0, fileName.lastIndexOf('.')) + fileSuffix + fileExtension,
						blob
					);
					progress += 1 / partsLength;

					// await fileSave(blob, {
					// 	fileName:
					// 		(await score.title()) +
					// 		' (' +
					// 		items[items.findIndex((part) => part.id === excerptId)].title +
					// 		')'
					// });
				}

				if (index === partsLength - 1) {
					progress = 1;
					isZipping = true;
					blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
						downloadIsDisabled = false;
						convertIsProcessing = false;
						return zipped;
					});
				}
			});

			// score.destroy;
			// score.setSoundFont;
			// score.synthAudio;
			// score.synthAudioBatch;
			// score.titleFilenameSafe;
		}
	}
</script>

<Snackbar bind:this={loadingSnackbar}>
	<Label>{errorMessage}</Label>
	<Actions>
		<IconButton class="material-icons-outlined" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<div class="fileHandling">
	<Button variant="outlined" on:click={handleMscz}>
		<Icon class="material-icons-outlined">file_upload</Icon>
		<Label>Select File</Label>
	</Button>
	<Select
		style="margin: 8px 0px 0px 0px;"
		variant="outlined"
		bind:value={exportType}
		on:click={updateConvertDisabled}
		label="Export to"
		required
	>
		{#each exportTypes as type}
			<Option value={type}>{type}</Option>
		{/each}
	</Select>
	{#if downloadIsDisabled}
		<Button
			style="margin: 8px 0px 0px 0px;"
			variant="raised"
			bind:disabled={convertIsDisabled}
			on:click={saveFile}
		>
			<Icon class="material-icons-outlined">swap_horiz</Icon>
			<Label>Convert</Label>
		</Button>
	{/if}
	{#if convertIsProcessing}
		{#if !isZipping}
			<LinearProgress {progress} buffer={0} />
		{:else}
			<LinearProgress indeterminate />
		{/if}
	{/if}
	{#if !downloadIsDisabled}
		<Button
			class="button-shaped-round"
			style="margin: 8px 0px 0px 0px;"
			bind:disabled={convertIsDisabled}
			color="secondary"
			variant="raised"
			href={window.URL.createObjectURL(blob)}
			download={title + '.zip'}
		>
			<Icon class="material-icons-outlined">file_download</Icon>
			<Label>Download</Label>
		</Button>
	{/if}
	{#if !fileIsLoading}
		{#if !convertIsProcessing}
			<p class="mdc-typography--subtitle1">{fileName}</p>
		{:else}
			<p class="mdc-typography--subtitle1" style="margin: 12px 0px 16px 0px">{fileName}</p>
		{/if}
	{:else}
		<CircularProgress style="height: 28px; width: 28px; margin: 16px 0px" indeterminate />
	{/if}
	<!-- <p class="mdc-typography--caption">{msczMetadata}</p> -->
</div>
{#if !optionsAreDisabled}
	<div class="options">
		<div class="partOptions">
			<Card variant="outlined" style="flex: 1;">
				<Content class="mdc-typography--subtitle2">What to export</Content>
				<List checkList>
					{#each items as item}
						<Item>
							<Checkbox bind:group={selected} value={item.id} />
							<Label>{item.title}</Label>
						</Item>
					{/each}
				</List>
				<Group variant="outlined" style="display: flex;">
					<Button on:click={selectAll} variant="outlined" style="flex: auto;"
						><Label>Select all</Label></Button
					>
					<Button on:click={clearSelection} variant="outlined" style="flex: auto;"
						><Label>Clear selection</Label></Button
					>
				</Group>
			</Card>
		</div>
		<div class="fileOptions">
			<Card class="fileOption" variant="outlined" style="flex: 1;">
				<Content class="mdc-typography--subtitle2">Export options</Content>
				<div class="optionsRoot">
					{#if exportType === 'PDF'}
						<PdfOptions />
					{:else if exportType === 'PNG'}
						<PngOptions {npages} />
					{:else if exportType === 'SVG'}
						<SvgOptions {npages} />
					{:else if exportType === 'MP3'}
						<Mp3Options />
					{:else if exportType === 'WAV'}
						<WavOptions />
					{:else if exportType === 'FLAC'}
						<FlacOptions />
					{:else if exportType === 'OGG'}
						<OggOptions />
					{:else if exportType === 'MIDI'}
						<MidiOptions />
					{:else if exportType === 'MusicXML'}
						<MusicXmlOptions />
					{:else if exportType === 'MSCZ'}
						<MsczOptions />
					{:else if exportType === 'MSCX'}
						<MscxOptions />
					{:else if exportType === 'Positions'}
						<PositionsOptions />
					{:else if exportType === 'Metadata'}
						<MetadataOptions />
					{:else}
						<p class="mdc-typography--body2">Invalid export target.</p>
					{/if}
				</div>
			</Card>
		</div>
	</div>
{/if}

<style>
	.fileHandling {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.options {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.partOptions,
	.fileOptions {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.optionsRoot {
		display: flex;
		flex-direction: column;
		padding: 16px;
	}
</style>

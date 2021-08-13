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

	let scores: WebMscore[] = [];
	let titles: String[] = [];
	let blob: Blob = new Blob();
	let zip = new JSZip();
	//@ts-ignore
	let newBlobs: FileWithHandle[] = [blob];
	//@ts-ignore
	let newOldBlobs: FileWithHandle[] = [];
	//@ts-ignore
	let msczMetadatas: String[] = [];
	let fileNames: String[] = ['No file loaded.'];
	let errorMessage = 'Unknown error.';
	let scoreLoaded = false;
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

	let batchMode = false;
	let convertIsDisabled = true;
	let downloadIsDisabled = true;
	let optionsAreDisabled = true;
	let fileIsLoading = false;
	let convertIsProcessing = false;
	let isZipping = false;

	function updateConvertDisabled() {
		if (
			newBlobs[0].size !== 0 &&
			exportType != '' &&
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

	async function handleMscz() {
		scores = [];
		titles = [];
		msczMetadatas = [];
		fileNames = [];
		let tempScores = [];

		convertIsDisabled = true;
		//@ts-ignore
		newBlobs = await fileOpen([
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
				id: 'uploads',
				multiple: true
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
			return newOldBlobs;
		});

		if (newOldBlobs === newBlobs) {
			return;
		}

		batchMode = newBlobs.length > 1 ? true : false;

		newOldBlobs = newBlobs;

		for (let [index, blobs] of newBlobs.entries()) {
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

			fileNames.push(blobs.name);
			// if (scoreLoaded) {
			// 	score.destroy();
			// }

			WebMscore.ready.then(async () => {
				fileIsLoading = true;
				tempScores.push({
					scoreBlob: await WebMscore.load(fileExt, new Uint8Array(await blobs.arrayBuffer())).then(
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
							msczMetadatas.push(JSON.stringify(await loaded.metadata()));
							titles.push(await loaded.title());
							minUpdate = 1;
							sliderIsDisabled = false;
							return loaded;
						}
					),
					scoreIndex: index
				});
				if (tempScores.length === newBlobs.length) {
					msczMetadatas.sort(
						(a, b) =>
							tempScores[msczMetadatas.indexOf(a)].scoreIndex -
							tempScores[msczMetadatas.indexOf(b)].scoreIndex
					);
					titles.sort(
						(a, b) =>
							tempScores[titles.indexOf(a)].scoreIndex - tempScores[titles.indexOf(b)].scoreIndex
					);
					scores = tempScores
						.sort((a, b) => a.scoreIndex - b.scoreIndex)
						.map((value) => value.scoreBlob);
					fileIsLoading = false;
					if (exportType !== '') {
						convertIsDisabled = false;
						optionsAreDisabled = false;
						scoreLoaded = true;
					} else {
						convertIsDisabled = true;
					}
				}
			});
		}
	}

	async function saveFile() {
		let fileExtension = '.';
		let scoresLength = scores.length;
		let scoresPages: number[] = [];
		convertIsDisabled = true;
		downloadIsDisabled = true;
		convertIsProcessing = true;
		isZipping = false;
		progress = 0;
		zip = new JSZip();

		if (exportType === 'PNG' || exportType == 'SVG') {
			for (let [index, score] of scores.entries()) {
				scoresPages[index] = await score.npages();

				if (index === scoresLength - 1) {
					let pagesLength = scoresPages.reduce((a, b) => a + b, 0);

					for (let [indexNew, scoreNew] of scores.entries()) {
						for (let i of [...Array(scoresPages[indexNew]).keys()]) {
							if (exportType === 'PNG') {
								blob = await new Blob(
									[
										await (
											await scoreNew.savePng(
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
								blob = await new Blob(
									[await scoreNew.saveSvg(i, $exportOptions.drawPageBackground)],
									{
										type: 'image/svg+xml'
									}
								);
								fileExtension = '.svg';
							}

							if (blob.size != 0) {
								let fileSuffix = '-' + (i + 1).toString();
								zip.file(
									fileNames[indexNew].substring(0, fileNames[indexNew].lastIndexOf('.')) +
										fileSuffix +
										fileExtension,
									blob
								);
								progress += 1 / pagesLength;
							}

							if (indexNew === scoresLength - 1 && i === scoresPages[indexNew] - 1) {
								progress = 1;
								isZipping = true;
								blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
									downloadIsDisabled = false;
									convertIsProcessing = false;
									return zipped;
								});
							}
						}
					}
				}
			}
		} else {
			for (let [index, score] of scores.entries()) {
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
					zip.file(
						fileNames[index].substring(0, fileNames[index].lastIndexOf('.')) + fileExtension,
						blob
					);
					progress += 1 / scoresLength;

					// await fileSave(blob, {
					// 	fileName:
					// 		(await score.title()) +
					// 		' (' +
					// 		items[items.findIndex((part) => part.id === excerptId)].title +
					// 		')'
					// });
				}

				if (index === scoresLength - 1) {
					progress = 1;
					isZipping = true;
					blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
						downloadIsDisabled = false;
						convertIsProcessing = false;
						return zipped;
					});
				}
			}

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
		<Label>Select Files</Label>
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
			download={titles.join(', ') + '.zip'}
		>
			<Icon class="material-icons-outlined">file_download</Icon>
			<Label>Download</Label>
		</Button>
	{/if}
	{#if !fileIsLoading}
		{#if !convertIsProcessing}
			<p class="mdc-typography--subtitle1">
				{#each fileNames as fileName}
					{fileName}<br />
				{/each}
			</p>
		{:else}
			<p class="mdc-typography--subtitle1" style="margin: 12px 0px 16px 0px">
				{#each fileNames as fileName}
					{fileName}<br />
				{/each}
			</p>
		{/if}
	{:else}
		<CircularProgress style="height: 28px; width: 28px; margin: 16px 0px" indeterminate />
	{/if}
	<!-- <p class="mdc-typography--caption">{msczMetadata}</p> -->
</div>
{#if !optionsAreDisabled}
	<div class="options">
		<div class="fileOptions">
			<Card class="fileOption" variant="outlined" style="flex: 1;">
				<Content class="mdc-typography--subtitle2">Export options</Content>
				<div class="optionsRoot">
					{#if exportType === 'PDF'}
						<PdfOptions />
					{:else if exportType === 'PNG'}
						<PngOptions />
					{:else if exportType === 'SVG'}
						<SvgOptions />
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

<script lang="ts">
	import { exportOptions, homeState, languageState } from '../stores.js';
	import Button, { Group, Label, Icon } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import List, { Item } from '@smui/list';
	import Checkbox from '@smui/checkbox';
	import Card, { Content } from '@smui/card';
	import CircularProgress from '@smui/circular-progress';
	import LinearProgress from '@smui/linear-progress';
	import Snackbar, { Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { fileOpen } from 'browser-fs-access';
	import JSZip from 'jszip';
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
	import { t } from '$lib/i18n/i18n';

	let scores: WebMscore[] = [];
	let titles: String[] = [];
	let blob: Blob = new Blob();
	let zip = new JSZip();
	//@ts-ignore
	let files: FileWithHandle[] = [blob];
	// $: files = [blob];
	//@ts-ignore
	let oldFiles: FileWithHandle[] = [blob];
	// $: oldFiles = [];
	//@ts-ignore
	let msczMetadatas: String[];
	// $: msczMetadatas = [$t('no_file_metadata')];
	let fileNames: String[] = [$t('no_file_loaded')];
	$: fileNames = isFileLoaded === false ? [$t('no_file_loaded')] : fileNames;
	let errorMessage = $t('unknown_error');
	let npages: number[] = [1];
	let progress = 0;
	let loadingSnackbar;
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
			title: $t('full_score')
		}
	];
	$: items[items.findIndex((part) => part.id === -1)].title = $t('full_score');
	let selected = [items[items.findIndex((part) => part.id === -1)].id];

	let isFileLoaded: boolean = false;
	let batchMode: boolean = false;
	// $homeState.convertIsDisabled = true;
	let oldConvertIsDisabled: boolean = true;
	// $homeState.downloadIsDisabled = true;
	let optionsAreDisabled: boolean = true;
	let fileIsLoading: boolean = false;
	let convertIsProcessing: boolean = false;
	let isZipping: boolean = false;

	function updateConvertDisabled() {
		// console.log(exportTypes);
		// console.log(exportType);
		// console.log(oldExportTypeIndex);
		// console.log(exportTypes.indexOf(exportType));
		// oldExportTypeIndex = exportTypes.indexOf(exportType);
		// console.log(exportTypes);
		// console.log(exportType);
		// console.log(oldExportTypeIndex);
		// console.log(exportTypes.indexOf(exportType));
		if (
			files[0].size > 0 &&
			!(files.length === 1 && files[0].size === 0 && files[0].type === '') &&
			exportType !== '' &&
			selected.length > 0 &&
			exportTypes.includes(exportType) &&
			!fileIsLoading
		) {
			$homeState.convertIsDisabled = false;
			optionsAreDisabled = false;
		} else {
			$homeState.convertIsDisabled = true;
		}
		$homeState.downloadIsDisabled = true;
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
		oldConvertIsDisabled = $homeState.convertIsDisabled;
		$homeState.convertIsDisabled = true;
		//@ts-ignore
		files = await fileOpen([
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
				description: $t('all_supported_files'),
				id: 'uploads',
				multiple: true
			},
			{
				mimeTypes: ['application/x-musescore', 'application/x-musescore+xml'],
				extensions: ['.mscz', '.mscx'],
				description: $t('musescore_files')
			},
			{
				mimeTypes: ['application/vnd.recordare.musicxml', 'application/vnd.recordare.musicxml+xml'],
				extensions: ['.mxl', '.musicxml', '.xml'],
				description: $t('musicxml_files')
			},
			// {
			// 	mimeTypes: ['audio/midi'],
			// 	extensions: ['.mid', '.midi', '.kar'],
			// 	description: $t('midi_files')
			// },
			// {
			// 	mimeTypes: ['application/x-musedata'],
			// 	extensions: ['.md'],
			// 	description: $t('musedata_files')
			// },
			// {
			// 	mimeTypes: ['application/x-capella'],
			// 	extensions: ['.cap', '.capx'],
			// 	description: $t('capella_files')
			// },
			// {
			// 	mimeTypes: ['application/x-biab'],
			// 	extensions: ['.mgu', '.sgu'],
			// 	description: $t('bb_files') + $t('experimental')
			// },
			// {
			// 	mimeTypes: ['application/x-overture'],
			// 	extensions: ['.ove', '.scw'],
			// 	description: $t('overture_score_writer_files') + $t('experimental')
			// },
			// {
			// 	mimeTypes: ['application/x-bww'],
			// 	extensions: ['.bmw', '.bww'],
			// 	description: $t('bagpipe_music_writer_files') + $t('experimental')
			// },
			{
				mimeTypes: ['audio/x-gtp'],
				extensions: ['.gtp', '.gp3', '.gp4', '.gp5', '.gpx', '.gp'],
				description: $t('guitar_pro_files')
			},
			{
				mimeTypes: ['audio/x-ptb'],
				extensions: ['.ptb'],
				description: $t('power_tab_editor_files') + $t('experimental')
			}
			// {
			// 	mimeTypes: ['application/x-musescore', 'application/x-musescore+xml'],
			// 	extensions: ['.mscz,', '.mscx,'],
			// 	description: $t('musescore_backup_files')
			// }
		]).catch(() => {
			$homeState.convertIsDisabled = oldConvertIsDisabled;
			return oldFiles;
		});

		if (oldFiles === files) {
			return;
		}

		return handleUploads(files);
	}

	async function handleUploads(inputFiles: File[]) {
		scores = [];
		titles = [];
		msczMetadatas = [];
		fileNames = [];
		let tempScores = [];

		batchMode = inputFiles.length > 1 ? true : false;

		oldFiles = inputFiles;

		for (let [index, blobs] of inputFiles.entries()) {
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
				errorMessage = $t('invalid_file_extension_error');
				loadingSnackbar.open();
				return;
			}

			fileNames = [...fileNames, blobs.name];
			isFileLoaded = true;

			WebMscore.ready.then(async () => {
				fileIsLoading = true;
				tempScores.push({
					scoreBlob: await WebMscore.load(fileExt as any, new Uint8Array(await blobs.arrayBuffer())).then(
						async (loaded) => {
							await loaded.setSoundFont(
								new Uint8Array(await (await fetch('./MS Basic.sf3')).arrayBuffer())
							);
							if (!batchMode) {
								await loaded.generateExcerpts();
								await loaded.metadata().then(async (meta) => {
									msczMetadatas.push(JSON.stringify(meta));
									items = [items[0]];
									meta.excerpts.forEach((part) => items.push(part));
								});
								npages.push(await loaded.npages());
							} else {
								msczMetadatas.push(JSON.stringify(await loaded.metadata()));
							}
							titles.push(await loaded.title());
							return loaded;
						}
					),
					scoreIndex: index
				});
				if (tempScores.length === inputFiles.length) {
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
						$homeState.convertIsDisabled = false;
						optionsAreDisabled = false;
					} else {
						$homeState.convertIsDisabled = true;
					}
				}
			});
		}
	}

	async function saveFile() {
		if (!batchMode) {
			let fileExtension = '.';
			let partsLength = selected.length;
			let partsPages: number[] = [];
			$homeState.convertIsDisabled = true;
			$homeState.downloadIsDisabled = true;
			convertIsProcessing = true;
			isZipping = false;
			progress = 0;
			zip = new JSZip();

			if (exportType === 'PNG' || exportType === 'SVG') {
				selected.forEach(async (excerptId, index) => {
					scores[0].setExcerptId(excerptId);
					partsPages.push(await scores[0].npages());

					if (index === partsLength - 1) {
						let pagesLength = partsPages.reduce((a, b) => a + b, 0);

						selected.forEach(async (excerptIdNew, indexNew) => {
							scores[0].setExcerptId(excerptIdNew);
							[...Array(partsPages[indexNew]).keys()].forEach(async (_, i) => {
								if (exportType === 'PNG') {
									blob = await new Blob(
										[
											await (
												await scores[0].savePng(
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
										[await scores[0].saveSvg(i, $exportOptions.drawPageBackground)],
										{
											type: 'image/svg+xml'
										}
									);
									fileExtension = '.svg';
								}

								if (blob.size !== 0) {
									let fileSuffix =
										'-' +
										items[items.findIndex((part) => part.id === excerptIdNew)].title +
										'-' +
										(i + 1).toString();
									if (excerptIdNew === -1) {
										fileSuffix = '-' + (i + 1).toString();
									}
									zip.file(
										fileNames[0].substring(0, fileNames[0].lastIndexOf('.')) +
											fileSuffix +
											fileExtension,
										blob
									);
									progress += 1 / pagesLength;
								}

								if (indexNew === partsLength - 1 && i === partsPages[indexNew] - 1) {
									progress = 1;
									isZipping = true;
									blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
										$homeState.downloadIsDisabled = false;
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
					scores[0].setExcerptId(excerptId);
					switch (exportType) {
						case 'PDF':
							blob = await new Blob([await (await scores[0].savePdf()).buffer], {
								type: 'application/pdf'
							});
							fileExtension = '.pdf';
							break;
						case 'MP3':
							blob = await new Blob([await (await scores[0].saveAudio('mp3')).buffer], {
								type: 'audio/mpeg'
							});
							fileExtension = '.mp3';
							break;
						case 'WAV':
							blob = await new Blob([await (await scores[0].saveAudio('wav')).buffer], {
								type: 'audio/vnd.wave'
							});
							fileExtension = '.wav';
							break;
						case 'FLAC':
							blob = await new Blob([await (await scores[0].saveAudio('flac')).buffer], {
								type: 'audio/flac'
							});
							fileExtension = '.flac';
							break;
						case 'OGG':
							blob = await new Blob([await (await scores[0].saveAudio('ogg')).buffer], {
								type: 'audio/ogg'
							});
							fileExtension = '.ogg';
							break;
						case 'MIDI':
							blob = await new Blob(
								[
									await (
										await scores[0].saveMidi(
											$exportOptions.midiExpandRepeats,
											$exportOptions.exportRPNs
										)
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
								blob = await new Blob([await (await scores[0].saveMxl()).buffer], {
									type: 'application/vnd.recordare.musicxml'
								});
								fileExtension = '.mxl';
							} else {
								if ($exportOptions.outdated) {
									blob = await new Blob([await await scores[0].saveXml()], {
										type: 'application/vnd.recordare.musicxml+xml'
									});
									fileExtension = '.xml';
								} else {
									blob = await new Blob([await await scores[0].saveXml()], {
										type: 'application/vnd.recordare.musicxml+xml'
									});
									fileExtension = '.musicxml';
								}
							}
							break;
						case 'MSCZ':
							blob = await new Blob([await (await scores[0].saveMsc('mscz')).buffer], {
								type: 'application/x-musescore'
							});
							fileExtension = '.mscz';
							break;
						case 'MSCX':
							blob = await new Blob([await (await scores[0].saveMsc('mscx')).buffer], {
								type: 'application/x-musescore+xml'
							});
							fileExtension = '.mscx';
							break;
						case 'Positions':
							blob = await new Blob(
								[await await scores[0].savePositions($exportOptions.ofSegments)],
								{
									type: 'application/json'
								}
							);
							fileExtension = '.json';
							break;
						case 'Metadata':
							blob = await new Blob([await await scores[0].saveMetadata()], {
								type: 'application/json'
							});
							fileExtension = '.json';
							break;
						default:
							blob = new Blob();
							errorMessage = $t('invalid_export_target_error');
							loadingSnackbar.open();
							return;
					}

					if (blob.size !== 0) {
						let fileSuffix = '-' + items[items.findIndex((part) => part.id === excerptId)].title;
						if (excerptId === -1) {
							fileSuffix = '';
						}
						zip.file(
							fileNames[0].substring(0, fileNames[0].lastIndexOf('.')) + fileSuffix + fileExtension,
							blob
						);
						progress += 1 / partsLength;
					}

					if (index === partsLength - 1) {
						progress = 1;
						isZipping = true;
						blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
							$homeState.downloadIsDisabled = false;
							convertIsProcessing = false;
							return zipped;
						});
					}
				});
			}
		} else {
			let fileExtension = '.';
			let scoresLength = scores.length;
			let scoresPages: number[] = [];
			$homeState.convertIsDisabled = true;
			$homeState.downloadIsDisabled = true;
			convertIsProcessing = true;
			isZipping = false;
			progress = 0;
			zip = new JSZip();

			if (exportType === 'PNG' || exportType === 'SVG') {
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

								if (blob.size !== 0) {
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
										$homeState.downloadIsDisabled = false;
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
										await score.saveMidi(
											$exportOptions.midiExpandRepeats,
											$exportOptions.exportRPNs
										)
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
								if ($exportOptions.outdated) {
									blob = await new Blob([await await score.saveXml()], {
										type: 'application/vnd.recordare.musicxml+xml'
									});
									fileExtension = '.xml';
								} else {
									blob = await new Blob([await await score.saveXml()], {
										type: 'application/vnd.recordare.musicxml+xml'
									});
									fileExtension = '.musicxml';
								}
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
							errorMessage = $t('invalid_export_target_error');
							loadingSnackbar.open();
							return;
					}

					if (blob.size !== 0) {
						zip.file(
							fileNames[index].substring(0, fileNames[index].lastIndexOf('.')) + fileExtension,
							blob
						);
						progress += 1 / scoresLength;
					}

					if (index === scoresLength - 1) {
						progress = 1;
						isZipping = true;
						blob = await zip.generateAsync({ type: 'blob' }).then((zipped) => {
							$homeState.downloadIsDisabled = false;
							convertIsProcessing = false;
							return zipped;
						});
					}
				}
			}
		}
	}

	// make `handleUploads` globally available
	// TODO: use `globalThis`
	window['handleUploads'] = handleUploads;

	// have preloaded files
	if (window?.['preloadedUploads']?.length > 0) {
		handleUploads(window['preloadedUploads']);
	}
	window['preloadedUploads'] = [] as File[];
</script>

<Snackbar bind:this={loadingSnackbar}>
	<Label>{errorMessage}</Label>
	<Actions>
		<IconButton class="material-icons-outlined" title={$t('dismiss')}>close</IconButton>
	</Actions>
</Snackbar>

<div class="convert">
	<div class="fileHandling">
		<Button variant="outlined" on:click={handleMscz}>
			<Icon class="material-icons-outlined">file_upload</Icon>
			<Label>{$t('select_files_label')}</Label>
		</Button>
		<Select
			style="margin-inline: 0px; margin-block: 8px 0px;"
			variant="outlined"
			bind:value={exportType}
			on:MDCSelect:change={updateConvertDisabled}
			label={$t('export_to_label')}
			required
		>
			{#each [...exportTypes] as type (exportTypes.indexOf(type))}
				<!-- 11 is the index of exportTypes where translatable export types begin -->
				{#if exportTypes.indexOf(type) < 11}
					<Option value={type}>{type}</Option>
				{:else}
					<Option value={type}>{$t(type.charAt(0).toLowerCase() + type.slice(1))}</Option>
				{/if}
			{/each}
		</Select>
		<div class="buttons">
			<div
				style="margin-inline: 0px 4px; margin-block: 8px 0px; display: flex; flex-flow: column nowrap; flex: 1;"
			>
				<Button
					style="padding: 0;"
					variant="raised"
					bind:disabled={$homeState.convertIsDisabled}
					on:click={saveFile}
				>
					{#if $languageState.direction === 'rtl'}
						<Icon class="material-icons-outlined" style="transform: scaleX(-1);">swap_horiz</Icon>
					{:else}
						<Icon class="material-icons-outlined">swap_horiz</Icon>
					{/if}
					<Label>{$t('convert_label')}</Label>
				</Button>
				{#if convertIsProcessing}
					{#if !isZipping}
						<LinearProgress {progress} buffer={0} />
					{:else}
						<LinearProgress indeterminate />
					{/if}
				{/if}
			</div>
			{#if $homeState.downloadIsDisabled}
				<Button
					class="button-shaped-round"
					style="padding: 0; margin-inline: 4px 0px; margin-block: 8px 0px; flex: 1;"
					disabled
					color="secondary"
					variant="raised"
					download={titles.join(', ') + '.zip'}
				>
					<Icon class="material-icons-outlined">file_download</Icon>
					<Label>{$t('download_label')}</Label>
				</Button>
			{:else}
				<Button
					class="button-shaped-round"
					style="padding: 0; margin-inline: 4px 0px; margin-block: 8px 0px; flex: 1;"
					color="secondary"
					variant="raised"
					href={window.URL.createObjectURL(blob)}
					download={titles.join(', ') + '.zip'}
				>
					<Icon class="material-icons-outlined">file_download</Icon>
					<Label>{$t('download_label')}</Label>
				</Button>
			{/if}
		</div>
		{#if !fileIsLoading}
			{#if !convertIsProcessing}
				<p class="mdc-typography--subtitle1">
					{#each fileNames as fileName}
						{fileName}<br />
					{/each}
				</p>
			{:else}
				<p class="mdc-typography--subtitle1" style="margin-inline: 0px; margin-block: 12px 16px;">
					{#each fileNames as fileName}
						{fileName}<br />
					{/each}
				</p>
			{/if}
		{:else}
			<CircularProgress
				style="block-size: 28px; inline-size: 28px; margin-inline: 0px; margin-block: 16px;"
				indeterminate
			/>
		{/if}
	</div>
	{#if !optionsAreDisabled}
		<div class="options">
			{#if !batchMode}
				<div class="partOptions">
					<Card variant="outlined" style="flex: 1;">
						<Content class="mdc-typography--subtitle2">{$t('what_to_export')}</Content>
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
								><Label>{$t('select_all_label')}</Label></Button
							>
							<Button on:click={clearSelection} variant="outlined" style="flex: auto;"
								><Label>{$t('clear_selection_label')}</Label></Button
							>
						</Group>
					</Card>
				</div>
			{/if}
			<div class="fileOptions">
				<Card class="fileOption" variant="outlined" style="flex: 1;">
					<Content class="mdc-typography--subtitle2">{$t('export_options')}</Content>
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
							<p class="mdc-typography--body2">{$t('invalid_export_target_error')}</p>
						{/if}
					</div>
				</Card>
			</div>
		</div>
	{/if}
</div>

<style>
	.convert {
		align-self: center;
		max-inline-size: 1024px;
		inline-size: 100%;
	}

	.fileHandling {
		display: flex;
		flex-flow: column wrap;
		justify-content: space-around;
	}

	.options {
		display: flex;
		flex-flow: row wrap;
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

	.buttons {
		display: flex;
		flex-flow: row wrap;
		align-items: stretch;
		justify-content: space-around;
	}
</style>

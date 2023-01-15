<script lang="ts">
	import {
		Heading,
		Secondary,
		Label,
		Input,
		Button,
		Radio,
		Select,
		Tooltip,
		Checkbox,
		Span,
		Dropzone
	} from 'flowbite-svelte';
	import {
		Layer,
		type LayerType,
		LayerTypeEnum,
		Rectangle,
		Line,
		Ellipse,
		Polygon,
		ImageData,
		TextData,
		newLayer
	} from '$lib/layer';
	import Icon from '@iconify/svelte';
	import NumberInput from '$lib/NumberInput.svelte';
	import ColorInput from '$lib/ColorInput.svelte';
	import PropertyBlock from '$lib/PropertyBlock.svelte';
	import { onMount } from 'svelte';
	import HAlignButtons from '$lib/HAlignButtons.svelte';
	import VAlignButtons from '$lib/VAlignButtons.svelte';
	import { families, textAligns, textBaselines, types } from '$lib/constants';

	let elCanvas: HTMLCanvasElement;
	let elDiv: HTMLDivElement;
	let elAnchor: HTMLAnchorElement;
	let elScrollTo: HTMLElement;
	let elDropZone: Dropzone;
	let canvasWidth = 1200;
	let canvasHeight = 630;
	let canvasData: string;
	let updateTimerId: number | undefined;
	let imgMaxHeight = 'inherit';
	let layers: Layer[] = [];
	let selectedLayerId = -1;
	let current: Layer | undefined;
	let autoPreviewUpdate = true;
	let selectedLayerType: LayerType;

	function updatePreview() {
		if (elCanvas) {
			if (updateTimerId) {
				window.clearTimeout(updateTimerId);
				updateTimerId = undefined;
			}
			updateTimerId = window.setTimeout(updateCanvas, 500);
		}
	}

	function updateCanvas() {
		if (elCanvas) {
			const ctx = elCanvas.getContext('2d');
			if (ctx) {
				console.log('updateCanvas');
				ctx.clearRect(0, 0, elCanvas!.width, elCanvas.height);
				[...layers].reverse().forEach((layer) => {
					ctx.save();
					layer.render(ctx);
					ctx.restore();
				});

				canvasData = elCanvas.toDataURL('image/png');
			}
		}
	}

	function resize() {
		if (elDiv) {
			imgMaxHeight = `${elDiv.clientHeight}px`;
		}
	}

	function handleClickReset() {
		canvasWidth = 1200;
		canvasHeight = 630;
	}

	function handleClickAdd() {
		let newId = 0;
		if (layers.length > 0) {
			newId = layers.reduce((a, b) => (a.id > b.id ? a : b)).id;
		}
		newId++;

		let layer = new Rectangle(newId, `レイヤー#${newId}`, canvasWidth, canvasHeight);

		layers = [layer, ...layers];
		selectedLayerType = layer.type;
		selectedLayerId = newId;
	}

	function handleClickUp(i: number) {
		if (layers.length > 1 && i != 0) {
			const target = layers[i];
			layers[i] = layers[i - 1];
			layers[i - 1] = target;
		}
	}

	function handleClickDown(i: number) {
		if (layers.length > 1 && i != layers.length - 1) {
			const target = layers[i];
			layers[i] = layers[i + 1];
			layers[i + 1] = target;
		}
	}

	function handleClickTrash(i: number) {
		const targetId = layers[i].id;
		layers = [...layers.slice(0, i), ...layers.slice(i + 1)];
		if (layers.length == 0) {
			selectedLayerId = -1;
		} else if (selectedLayerId == targetId) {
			selectedLayerId = layers[Math.max(i - 1, 0)].id;
		}
	}

	function handleClickDownload() {
		if (elCanvas && elAnchor) {
			const a = elAnchor;
			elCanvas.toBlob((blob: Blob | null) => {
				if (blob) {
					a.href = URL.createObjectURL(blob);
					a.download = 'CanvasData.png';
					a.click();

					URL.revokeObjectURL(a.href);
				}
			}, 'image/png');
		}
	}

	function handleChangeFile(e: Event) {
		try {
			const target = e.target as HTMLInputElement;
			const file = (target.files as FileList)[0];
			if (!file.type.includes('image/')) {
				throw new Error('selected file is not image');
			}
			const reader = new FileReader();

			reader.onload = () => {
				if (current instanceof ImageData) {
					current.elImage.src = reader.result as string;
					current.fileName = file.name;

					current.rect.x = current.rect.y = 0;
					current.rect.width = current.elImage.naturalWidth;
					current.rect.height = current.elImage.naturalHeight;
				}
			};
			reader.readAsDataURL(file);
		} catch (err) {
			console.log(err);
		}
	}

	function handleClickFitCanvasWidth() {
		if (current instanceof ImageData) {
			current.rect.width = canvasWidth;
			if (current.fixedRatio) {
				const nw = current.elImage.naturalWidth;
				const nh = current.elImage.naturalHeight;
				current.rect.height = Math.floor((nh * canvasWidth) / nw);
			}
		}
	}

	function handleClickFitCanvasHeight() {
		if (current instanceof ImageData) {
			current.rect.height = canvasHeight;
			if (current.fixedRatio) {
				const nw = current.elImage.naturalWidth;
				const nh = current.elImage.naturalHeight;
				current.rect.width = Math.floor((nw * canvasHeight) / nh);
			}
		}
	}

	function handleClickTextAlign(e: CustomEvent<{ align: string }>) {
		if (current instanceof TextData) {
			if (e.detail.align == 'left') {
				current.align = 'left';
			} else if (e.detail.align == 'center') {
				current.align = 'center';
			} else if (e.detail.align == 'right') {
				current.align = 'right';
			} else if (e.detail.align == 'top') {
				current.baseline = 'top';
			} else if (e.detail.align == 'middle') {
				current.baseline = 'middle';
			} else if (e.detail.align == 'bottom') {
				current.baseline = 'bottom';
			}
		}
	}

	onMount(() => {
		handleClickAdd();
	});

	$: onChangeType(selectedLayerType);
	function onChangeType(type: LayerType) {
		console.log('onChangeType');
		if (current && current.type != type) {
			const id = current.id;
			current = newLayer(type, id, current.name, canvasWidth, canvasHeight);

			const index = layers.findIndex((layer) => layer.id == id);
			layers[index] = current;
		}
	}

	$: onChangeSelectedLayer(selectedLayerId);
	function onChangeSelectedLayer(selected: number) {
		console.log('onChangeSelectedLayer');
		if ((current = layers.find((layer) => layer.id == selected))) {
			selectedLayerType = current.type;
		} else {
			selectedLayerId = -1;
			selectedLayerType = LayerTypeEnum.Rectangle;
		}
	}

	$: if (elScrollTo) {
		elScrollTo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	}

	$: if (elDiv) {
		imgMaxHeight = `${elDiv.clientHeight}px`;
	}

	$: if (elCanvas) {
		updateCanvas();
	}

	$: if (autoPreviewUpdate) {
		canvasWidth;
		canvasHeight;
		current;
		layers;

		updatePreview();
	}
</script>

<svelte:window on:resize={resize} />
<div class="flex flex-1">
	<!-- left -->
	<div class="flex flex-col flex-1 p-2 justify-center">
		<Heading class="flex gap-8 items-center mb-2" customSize="text-lg" tag="h2">
			プレビュー
			<Secondary class="flex gap-8">
				<Button size="sm" on:click={updatePreview}>更新</Button>
				<Checkbox bind:checked={autoPreviewUpdate}>自動更新</Checkbox>
			</Secondary>
		</Heading>

		<div class="flex-1" bind:this={elDiv}>
			{#if canvasData}
				<img
					class="h-auto mx-auto preview"
					style="max-height:{imgMaxHeight}"
					src={canvasData}
					alt="preview"
				/>
			{/if}
		</div>

		<div class="hidden">
			<canvas bind:this={elCanvas} width={canvasWidth} height={canvasHeight} />
		</div>

		<div class="my-2">
			<Heading tag="h3" customSize="text-base">キャンバスサイズ</Heading>
			<div class="flex mt-2 gap-2">
				<div class="flex-1">
					<NumberInput label="幅" id="canvas_width" min="1" max="2000" bind:value={canvasWidth} />
				</div>
				<div class="flex-1">
					<NumberInput
						label="高さ"
						id="canvas_height"
						min="1"
						max="2000"
						bind:value={canvasHeight}
					/>
				</div>
				<Button size="sm" on:click={handleClickReset}>リセット</Button>
			</div>
		</div>

		<div class="my-6 self-center">
			<Button disabled={layers.length == 0} on:click={handleClickDownload}
				>画像をダウンロード</Button
			>
			<a class="hidden" bind:this={elAnchor} href="#download">Download</a>
		</div>
	</div>
	<!-- right -->
	<div class="w-96 border-l border-slate-500 p-2 flex flex-col">
		<!-- layers-->
		<div class="h-60 min-h-60 max-h-60">
			<div class="flex items-center mb-2">
				<div class="flex-1">
					<Heading tag="h3" customSize="text-base">レイヤー</Heading>
				</div>
				<div>
					<Button size="sm" on:click={handleClickAdd}>追加</Button>
				</div>
			</div>
			{#if layers.length > 0}
				<ul
					class="max-h-48 overflow-y-auto bg-white rounded border border-gray-200 dark:bg-gray-900 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600"
				>
					{#each layers as layer, i (layer.id)}
						<li class="flex items-center h-12 p-2">
							<Radio
								class="flex-1"
								bind:group={selectedLayerId}
								name="layers"
								id="layer{layer.id}"
								value={layer.id}
							>
								{layer.name}
							</Radio>
							<div class="inline-flex gap-2">
								<button disabled={i == 0} class="btn-icon" on:click={() => handleClickUp(i)}>
									<Icon icon="mdi:arrow-up" height="auto" />
								</button>
								<Tooltip style="light">上に移動</Tooltip>
								<button
									disabled={i == layers.length - 1}
									class="btn-icon"
									on:click={() => handleClickDown(i)}
								>
									<Icon icon="mdi:arrow-down" height="auto" />
								</button>
								<Tooltip style="light">上に移動</Tooltip>
								<button class="btn-icon btn-danger" on:click={() => handleClickTrash(i)}>
									<Icon icon="mdi:trash" height="auto" />
								</button>
								<Tooltip style="light">{layer.name}を削除</Tooltip>
							</div>
							{#if current && current.id == layer.id}
								<span bind:this={elScrollTo} />
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<!-- properties -->
		<Heading tag="h3" customSize="text-base">プロパティ</Heading>
		{#if current}
			<div class="flex-1 overflow-y-auto">
				<!-- name -->
				<div class="flex items-center gap-2">
					<Label for="name">名称</Label>
					<Input size="sm" id="name" class="flex-1" bind:value={current.name} />
				</div>
				<!-- type -->
				<div class="flex items-center gap-2 mt-2">
					<Label for="type">形状</Label>
					<Select
						size="sm"
						id="type"
						class="flex-1"
						items={types}
						bind:value={selectedLayerType}
						placeholder="レイヤーの形状を選択"
					/>
				</div>

				<!-- クラス固有のプロパティ -->
				{#if current instanceof TextData}
					<!-- テキスト -->
					<div class="flex items-center gap-2 mt-2">
						<Label for="text">テキスト</Label>
						<Input size="sm" id="text" class="flex-1" bind:value={current.text} />
					</div>
					<!-- フォント -->
					<PropertyBlock name="フォント">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<Select
								size="sm"
								items={families}
								bind:value={current.family}
								placeholder="フォントファミリーを選択"
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm truncate">
							{current.font}
						</Span>
					</PropertyBlock>
					<!-- 配置 -->
					<PropertyBlock name="配置">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<Select
								size="sm"
								items={textAligns}
								bind:value={current.align}
								placeholder="水平方向の配置を選択"
							/>
							<Select
								id="baseline"
								size="sm"
								items={textBaselines}
								bind:value={current.baseline}
								placeholder="垂直方向の配置を選択"
							/>
							<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.x}>
								<HAlignButtons
									bind:value={current.x}
									{canvasWidth}
									on:click={handleClickTextAlign}
								/>
							</NumberInput>
							<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.y}>
								<VAlignButtons
									bind:value={current.y}
									{canvasHeight}
									on:click={handleClickTextAlign}
								/>
							</NumberInput>
							<NumberInput
								label="最大幅"
								id="max_width"
								min="0"
								max="2000"
								bind:value={current.maxWidth}
							>
								<button
									class="btn-icon"
									on:click={() => {
										if (current instanceof TextData) {
											current.maxWidth = canvasWidth;
										}
									}}
								>
									<Icon icon="mdi:arrow-expand-horizontal" height="auto" />
								</button>
								<Tooltip style="light">幅をキャンバスに合わせる</Tooltip>
							</NumberInput>
						</div>
						<Span slot="summary" class="font-normal text-sm truncate">
							{current.align}, {current.baseline}
							({current.x}, {current.y}) / {current.maxWidth}px
						</Span>
					</PropertyBlock>
				{:else if current instanceof ImageData}
					<!-- 画像 -->
					<PropertyBlock name="画像">
						<div slot="props" class="ml-2 flex">
							<button on:click={() => document.getElementById('dropzone')?.click()}>
								<img
									src={current.elImage.src}
									alt="selected"
									class={current.elImage.src ? 'selected-image' : 'hidden'}
								/>
							</button>
							<Dropzone
								id="dropzone"
								bind:this={elDropZone}
								accept="image/*"
								class="!h-24 {current.elImage.src ? 'hidden' : ''}"
								on:change={handleChangeFile}
							>
								<div class="mb-2 text-gray-400">
									<Icon icon="mdi:upload" height="auto" />
								</div>
								<p class="text-center mb-2 text-sm text-gray-500 dark:text-gray-400">
									画像ファイルをドロップ<br />
									またはクリックしてファイルを選択
								</p>
							</Dropzone>
						</div>
						<Span slot="summary" class="font-normal text-sm truncate">
							{current.fileName}
						</Span>
					</PropertyBlock>
				{:else if current instanceof Polygon}
					<!-- 頂点の数 -->
					<PropertyBlock name="頂点の数">
						<div slot="props" class="ml-2">
							<NumberInput
								label="頂点の数"
								id="num_of_vertices"
								min="3"
								max="12"
								bind:value={current.paths.count}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.paths.count}
						</Span>
					</PropertyBlock>
					<!-- 頂点 -->
					{#each current.paths.pt as pt, index}
						<PropertyBlock name="頂点{index + 1}">
							<div slot="props" class="ml-2 flex gap-2">
								<NumberInput
									label="X"
									id="x_{index}"
									min="-2000"
									max="2000"
									bind:value={current.paths.pt[index].x}
								/>
								<NumberInput
									label="Y"
									id="y_{index}"
									min="-2000"
									max="2000"
									bind:value={current.paths.pt[index].y}
								/>
							</div>
							<Span slot="summary" class="font-normal text-sm">
								({current.paths.pt[index].x} , {current.paths.pt[index].y})
							</Span>
						</PropertyBlock>
					{/each}
				{:else if current instanceof Line}
					<!-- 始点 -->
					<PropertyBlock name="始点">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<NumberInput
								label="X"
								id="x_from"
								min="-2000"
								max="2000"
								bind:value={current.paths.pt[0].x}
							>
								<HAlignButtons bind:value={current.paths.pt[0].x} {canvasWidth} />
							</NumberInput>
							<NumberInput
								label="Y"
								id="y_from"
								min="-2000"
								max="2000"
								bind:value={current.paths.pt[0].y}
							>
								<VAlignButtons bind:value={current.paths.pt[0].y} {canvasHeight} />
							</NumberInput>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.paths.pt[0].x} , {current.paths.pt[0].y})
						</Span>
					</PropertyBlock>
					<!-- 終点 -->
					<PropertyBlock name="終点">
						<div slot="props" class="ml-2 flex gap-2">
							<NumberInput
								label="X"
								id="x_to"
								min="-2000"
								max="2000"
								bind:value={current.paths.pt[1].x}
							/>
							<NumberInput
								label="Y"
								id="y_to"
								min="-2000"
								max="2000"
								bind:value={current.paths.pt[1].y}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.paths.pt[1].x} , {current.paths.pt[1].y})
						</Span>
					</PropertyBlock>
				{:else if current instanceof Ellipse}
					<!-- 描画方法 -->
					<PropertyBlock name="描画方法">
						<div slot="props" class="ml-2">
							<Select
								size="sm"
								id="type"
								class="flex-1"
								bind:value={current.moveToCenter}
								items={[
									{ value: 1, name: '半径を描く' },
									{ value: 0, name: '弦を描く' }
								]}
								placeholder="描画方法を選択"
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.moveToCenter ? '半径を描く' : '弦を描く'}
						</Span>
					</PropertyBlock>
					<!-- 中心 -->
					<PropertyBlock name="中心">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.x}>
								<HAlignButtons bind:value={current.x} {canvasWidth} />
							</NumberInput>
							<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.y}>
								<VAlignButtons bind:value={current.y} {canvasHeight} />
							</NumberInput>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.x} , {current.y})
						</Span>
					</PropertyBlock>
					<!-- 半径 -->
					<PropertyBlock name="半径">
						<div slot="props" class="ml-2 flex gap-2">
							<NumberInput
								label="X"
								id="radius_x"
								min="1"
								max="2000"
								bind:value={current.radiusX}
							/>
							<NumberInput
								label="Y"
								id="radius_y"
								min="1"
								max="2000"
								bind:value={current.radiusY}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							X={current.radiusX} , Y={current.radiusY}
						</Span>
					</PropertyBlock>
					<!-- 傾きと角度 -->
					<PropertyBlock name="傾きと角度">
						<div slot="props" class="ml-2 flex flex-col gap-2">
							<NumberInput
								label="傾き"
								id="rotation"
								min="-360"
								max="360"
								bind:value={current.rotation}
							/>
							<div class="flex-1 flex gap-2">
								<NumberInput
									label="始角"
									id="start_angle"
									min="-360"
									max="360"
									bind:value={current.startAngle}
								/>
								<NumberInput
									label="終角"
									id="end_angle"
									min="-360"
									max="360"
									bind:value={current.endAngle}
								/>
							</div>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							傾き={current.rotation}&deg; , 始角={current.startAngle}&deg; , 終角={current.endAngle}&deg;
						</Span>
					</PropertyBlock>
				{/if}

				<!-- 共通プロパティ -->
				{#if current.rect !== undefined}
					<!-- 位置とサイズ -->
					<PropertyBlock name="位置とサイズ">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.rect.x}>
								<HAlignButtons
									bind:value={current.rect.x}
									{canvasWidth}
									selfWidth={current.rect.width}
								/>
							</NumberInput>
							<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.rect.y}>
								<VAlignButtons
									bind:value={current.rect.y}
									{canvasHeight}
									selfHeight={current.rect.height}
								/>
							</NumberInput>
							<NumberInput
								labelClass="w-7"
								label="幅"
								id="width"
								min="0"
								max="2000"
								bind:value={current.rect.width}
							>
								<button class="btn-icon" on:click={handleClickFitCanvasWidth}>
									<Icon icon="mdi:arrow-expand-horizontal" height="auto" />
								</button>
								<Tooltip style="light">幅をキャンバスに合わせる</Tooltip>
							</NumberInput>
							<NumberInput
								labelClass="w-7"
								label="高さ"
								id="height"
								min="0"
								max="2000"
								bind:value={current.rect.height}
							>
								<button class="btn-icon" on:click={handleClickFitCanvasHeight}>
									<Icon icon="mdi:arrow-expand-vertical" height="auto" />
								</button>
								<Tooltip style="light">幅をキャンバスに合わせる</Tooltip>
							</NumberInput>
							{#if current instanceof ImageData}
								<Checkbox bind:checked={current.fixedRatio}>縦横比を固定</Checkbox>
							{/if}
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.rect.x} , {current.rect.y}) - ({current.rect.width} , {current.rect.height})
						</Span>
					</PropertyBlock>
				{/if}
				{#if current.strokeOption !== undefined}
					<!-- 線の色と太さ -->
					<PropertyBlock name="線の色と太さ">
						<div slot="props" class="ml-2">
							<ColorInput
								id="border_color"
								bind:color={current.strokeOption.color}
								bind:alpha={current.strokeOption.alpha}
							/>
							<NumberInput
								label="太さ"
								id="border_width"
								min={current instanceof Line ? 1 : 0}
								max={Math.ceil(Math.sqrt(canvasWidth ** 2 + canvasHeight ** 2))}
								bind:value={current.strokeOption.width}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.strokeOption.width}px {current.strokeOption.color} / {current.strokeOption
								.alpha}%
						</Span>
					</PropertyBlock>
				{/if}
				{#if current.fillOption !== undefined}
					<!-- 塗りつぶし -->
					<PropertyBlock name="塗りつぶし">
						<div slot="props" class="ml-2">
							<ColorInput
								id="bg_color"
								bind:color={current.fillOption.color}
								bind:alpha={current.fillOption.alpha}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.fillOption.color} / {current.fillOption.alpha}%
						</Span>
					</PropertyBlock>
				{/if}
				{#if current.shadowOption !== undefined}
					<!-- シャドウ -->
					<PropertyBlock name="影">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<ColorInput
								id="shadow_color"
								bind:color={current.shadowOption.color}
								bind:alpha={current.shadowOption.alpha}
							/>
							<NumberInput
								label="ぼかし"
								id="shadow_blur"
								min="0"
								max="100"
								bind:value={current.shadowOption.blur}
							/>
							<NumberInput
								label="水平方向のオフセット"
								id="shadow_offset_x"
								min="-100"
								max="100"
								bind:value={current.shadowOption.offsetX}
							/>
							<NumberInput
								label="垂直方向のオフセット"
								id="shadow_offset_y"
								min="-100"
								max="100"
								bind:value={current.shadowOption.offsetY}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.shadowOption.blur}px ({current.shadowOption.offsetX} , {current.shadowOption
								.offsetY})
							{current.shadowOption.color} / {current.shadowOption.alpha}%
						</Span>
					</PropertyBlock>
				{/if}
			</div>
		{/if}
	</div>
</div>

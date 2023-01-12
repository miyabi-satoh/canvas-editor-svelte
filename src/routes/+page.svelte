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
		Span
	} from 'flowbite-svelte';
	import {
		Layer,
		type LayerType,
		LayerTypeEnum,
		Rectangle,
		Line,
		Shape,
		Ellipse,
		Shape2D,
		Polygon
	} from '../lib/layer';
	import Icon from '@iconify/svelte';
	import NumberInput from '../lib/NumberInput.svelte';
	import ColorInput from '$lib/ColorInput.svelte';
	import PropertyBlock from '$lib/PropertyBlock.svelte';
	import { onMount } from 'svelte';
	import Layout from './+layout.svelte';

	let elCanvas: HTMLCanvasElement | undefined = undefined;
	let elDiv: HTMLDivElement | undefined = undefined;
	let elAnchor: HTMLAnchorElement | undefined = undefined;
	let elScrollTo: HTMLElement;
	let canvasWidth = 1200;
	let canvasHeight = 630;
	let canvasData: string | undefined = undefined;
	let updateTimerId: number | undefined = undefined;
	let imgMaxHeight = 'inherit';
	let layers: Layer[] = [];
	let selectedLayerId = -1;
	let current: Layer | undefined;
	let fixedRatio = true;
	let autoPreviewUpdate = true;
	let selectedLayerType: LayerType;

	const types = [
		{ value: LayerTypeEnum.Line, name: '直線' },
		{ value: LayerTypeEnum.Rectangle, name: '矩形' },
		{ value: LayerTypeEnum.Ellipse, name: '円・楕円' },
		{ value: LayerTypeEnum.Polygon, name: '多角形' },
		{ value: LayerTypeEnum.Text, name: '文字' },
		{ value: LayerTypeEnum.Image, name: '画像' }
	];

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

		let layer = new Rectangle(newId, `レイヤー#${newId}`);
		layer.width = canvasWidth;
		layer.height = canvasHeight;

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

	function handleClickAlignLeft() {
		if (current instanceof Rectangle) {
			current.x = 0;
		}
	}

	function handleClickAlignCenter() {
		if (current instanceof Rectangle) {
			current.x = Math.floor((canvasWidth - current.width) / 2);
		}
	}

	function handleClickAlignRight() {
		if (current instanceof Rectangle) {
			current.x = canvasWidth - current.width;
		}
	}

	function handleClickAlignTop() {
		if (current instanceof Rectangle) {
			current.y = 0;
		}
	}

	function handleClickAlignMiddle() {
		if (current instanceof Rectangle) {
			current.y = Math.floor((canvasHeight - current.height) / 2);
		}
	}

	function handleClickAlignBottom() {
		if (current instanceof Rectangle) {
			current.y = canvasHeight - current.height;
		}
	}

	function handleClickFitWidth() {
		if (current instanceof Rectangle) {
			current.x = 0;
			current.width = canvasWidth;
		}
	}

	function handleClickFitHeight() {
		if (current instanceof Rectangle) {
			current.y = 0;
			current.height = canvasHeight;
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

	onMount(() => {
		handleClickAdd();
	});

	$: onChangeType(selectedLayerType);
	function onChangeType(type: LayerType) {
		console.log('onChangeType');
		if (current && current.type != type) {
			const id = current.id;
			const index = layers.findIndex((layer) => layer.id == id);
			switch (type) {
				case LayerTypeEnum.Line:
					let line = new Line(current.id, current.name);
					line.pt[1].x = canvasWidth;
					line.pt[0].y = Math.floor(canvasHeight / 2);
					line.pt[1].y = line.pt[0].y;
					current = line;
					break;
				case LayerTypeEnum.Ellipse:
					let arc = new Ellipse(current.id, current.name);
					arc.x = Math.floor(canvasWidth / 2);
					arc.y = Math.floor(canvasHeight / 2);
					arc.radiusX = canvasWidth - arc.x;
					arc.radiusY = canvasHeight - arc.y;
					current = arc;
					break;
				case LayerTypeEnum.Polygon:
					let polygon = new Polygon(current.id, current.name);
					polygon.pt[0].x = Math.floor(canvasWidth / 2);
					polygon.pt[1].y = canvasHeight;
					polygon.pt[2].x = canvasWidth;
					polygon.pt[2].y = canvasHeight;
					current = polygon;
					break;
				default:
					let rect = new Rectangle(current.id, current.name);
					rect.width = canvasWidth;
					rect.height = canvasHeight;
					current = rect;
					break;
			}
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
					<Select size="sm" id="type" class="flex-1" items={types} bind:value={selectedLayerType} />
				</div>
				{#if current instanceof Polygon}
					<!-- 頂点の数 -->
					<PropertyBlock name="頂点の数">
						<div slot="props" class="ml-2">
							<NumberInput
								label="頂点の数"
								id="num_of_vertices"
								min="3"
								max="12"
								bind:value={current.numOfVertices}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.numOfVertices}
						</Span>
					</PropertyBlock>
					<!-- 頂点 -->
					{#each current.pt as pt, index}
						<PropertyBlock name="頂点{index + 1}">
							<div slot="props" class="ml-2 flex gap-2">
								<NumberInput
									label="X"
									id="x_{index}"
									min="-2000"
									max="2000"
									bind:value={current.pt[index].x}
								/>
								<NumberInput
									label="Y"
									id="y_{index}"
									min="-2000"
									max="2000"
									bind:value={current.pt[index].y}
								/>
							</div>
							<Span slot="summary" class="font-normal text-sm">
								({current.pt[index].x} , {current.pt[index].y})
							</Span>
						</PropertyBlock>
					{/each}
				{/if}
				{#if current instanceof Line}
					<!-- 始点 -->
					<PropertyBlock name="始点">
						<div slot="props" class="ml-2 flex gap-2">
							<NumberInput
								label="X"
								id="x_from"
								min="-2000"
								max="2000"
								bind:value={current.pt[0].x}
							/>
							<NumberInput
								label="Y"
								id="y_from"
								min="-2000"
								max="2000"
								bind:value={current.pt[0].y}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.pt[0].x} , {current.pt[0].y})
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
								bind:value={current.pt[1].x}
							/>
							<NumberInput
								label="Y"
								id="y_to"
								min="-2000"
								max="2000"
								bind:value={current.pt[1].y}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.pt[1].x} , {current.pt[1].y})
						</Span>
					</PropertyBlock>
				{/if}
				{#if current instanceof Ellipse}
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
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.moveToCenter ? '半径を描く' : '弦を描く'}
						</Span>
					</PropertyBlock>
					<!-- 中心 -->
					<PropertyBlock name="中心">
						<div slot="props" class="ml-2 flex gap-2">
							<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.x} />
							<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.y} />
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
				{#if current instanceof Shape2D}
					<!-- 塗りつぶし -->
					<PropertyBlock name="塗りつぶし">
						<div slot="props" class="ml-2">
							<ColorInput id="bg_color" bind:color={current.bgColor} bind:alpha={current.bgAlpha} />
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.bgColor} / {current.bgAlpha}%
						</Span>
					</PropertyBlock>
				{/if}
				{#if current instanceof Rectangle}
					<!-- サイズ -->
					<PropertyBlock name="サイズ">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<div>
								<NumberInput
									labelClass="w-7"
									label="幅"
									id="width"
									min="0"
									max={canvasWidth * 2}
									bind:value={current.width}
								>
									<button class="btn-icon ml-2" on:click={handleClickFitWidth}>
										<Icon icon="mdi:arrow-expand-horizontal" height="auto" />
									</button>
									<Tooltip style="light">幅をキャンバスに合わせる</Tooltip>
								</NumberInput>
							</div>
							<div>
								<NumberInput
									labelClass="w-7"
									label="高さ"
									id="height"
									min="-2000"
									max={canvasHeight * 2}
									bind:value={current.height}
								>
									<button class="btn-icon ml-2" on:click={handleClickFitHeight}>
										<Icon icon="mdi:arrow-expand-vertical" height="auto" />
									</button>
									<Tooltip style="light">高さをキャンバスに合わせる</Tooltip>
								</NumberInput>
							</div>
							<Checkbox class="mt-1" bind:checked={fixedRatio}>縦横比を固定</Checkbox>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.width} x {current.height}
						</Span>
					</PropertyBlock>

					<!-- 位置 -->
					<PropertyBlock name="位置">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.x}>
								<div class="flex gap-3">
									<button class="btn-icon" on:click={handleClickAlignLeft}>
										<Icon icon="mdi:format-horizontal-align-left" height="auto" />
									</button>
									<Tooltip style="light">右寄せ</Tooltip>
									<button class="btn-icon" on:click={handleClickAlignCenter}>
										<Icon icon="mdi:format-horizontal-align-center" height="auto" />
									</button>
									<Tooltip style="light">中央寄せ</Tooltip>
									<button class="btn-icon" on:click={handleClickAlignRight}>
										<Icon icon="mdi:format-horizontal-align-right" height="auto" />
									</button>
									<Tooltip style="light">左寄せ</Tooltip>
								</div>
							</NumberInput>
							<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.y}>
								<div class="flex gap-3">
									<button class="btn-icon" on:click={handleClickAlignTop}>
										<Icon icon="mdi:format-vertical-align-top" height="auto" />
									</button>
									<Tooltip style="light">上寄せ</Tooltip>
									<button class="btn-icon" on:click={handleClickAlignMiddle}>
										<Icon icon="mdi:format-vertical-align-center" height="auto" />
									</button>
									<Tooltip style="light">中央寄せ</Tooltip>
									<button class="btn-icon" on:click={handleClickAlignBottom}>
										<Icon icon="mdi:format-vertical-align-bottom" height="auto" />
									</button>
									<Tooltip style="light">下寄せ</Tooltip>
								</div>
							</NumberInput>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.x} , {current.y})
						</Span>
					</PropertyBlock>
				{/if}
				{#if current instanceof Shape}
					<!-- 線の色と太さ -->
					<PropertyBlock name="線の色と太さ">
						<div slot="props" class="ml-2">
							<ColorInput
								id="border_color"
								bind:color={current.lineColor}
								bind:alpha={current.lineAlpha}
							/>
							<NumberInput
								label="太さ"
								id="border_width"
								min={current instanceof Line ? 1 : 0}
								max={Math.ceil(Math.sqrt(canvasWidth ** 2 + canvasHeight ** 2))}
								bind:value={current.lineWidth}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.lineWidth}px {current.lineColor} / {current.lineAlpha}%
						</Span>
					</PropertyBlock>

					<!-- シャドウ -->
					<PropertyBlock name="影">
						<div slot="props" class="ml-2 flex flex-col gap-1">
							<ColorInput
								id="shadow_color"
								bind:color={current.shadowColor}
								bind:alpha={current.shadowAlpha}
							/>
							<NumberInput
								label="ぼかし"
								id="shadow_blur"
								min="0"
								max="100"
								bind:value={current.shadowBlur}
							/>
							<NumberInput
								label="水平方向のオフセット"
								id="shadow_offset_x"
								min="-100"
								max="100"
								bind:value={current.shadowOffsetX}
							/>
							<NumberInput
								label="垂直方向のオフセット"
								id="shadow_offset_y"
								min="-100"
								max="100"
								bind:value={current.shadowOffsetY}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.shadowBlur}px ({current.shadowOffsetX} , {current.shadowOffsetY})
							{current.shadowColor} / {current.shadowAlpha}%
						</Span>
					</PropertyBlock>
				{/if}
			</div>
		{/if}
	</div>
</div>

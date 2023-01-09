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
	import { Layer, LayerType } from '../lib/layer';
	import Icon from '@iconify/svelte';
	import NumberInput from '../lib/NumberInput.svelte';
	import ColorInput from '$lib/ColorInput.svelte';
	import PropertyBlock from '$lib/PropertyBlock.svelte';

	let elCanvas: HTMLCanvasElement | undefined = undefined;
	let elDiv: HTMLDivElement | undefined = undefined;
	let elScrollTo: HTMLElement;
	let canvasWidth = 1200;
	let canvasHeight = 630;
	let canvasData: string | undefined = undefined;
	let updateTimerId: number | undefined = undefined;
	let imgMaxHeight = 'inherit';
	let layers: Layer[] = [];
	let selectedLayerId = -1;
	let current: Layer | undefined;
	// let maxId = 1;
	let fixedRatio = true;
	let autoPreviewUpdate = true;

	const types = [
		{ value: LayerType.Line, name: '直線' },
		{ value: LayerType.Rectangle, name: '矩形' },
		{ value: LayerType.Ellipse, name: '円・楕円' },
		{ value: LayerType.Polygon, name: '多角形' },
		{ value: LayerType.Text, name: '文字' },
		{ value: LayerType.Image, name: '画像' }
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
				layers.forEach((layer) => {
					ctx.save();
					layer.render(ctx);
					ctx.restore();
				});

				canvasData = elCanvas!.toDataURL('image/png');
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

		let layer = new Layer(newId, `レイヤー#${newId}`);
		layer.width = canvasWidth;
		layer.height = canvasHeight;

		layers = [layer, ...layers];
		selectedLayerId = newId;
	}

	function handleClickTrash(i: number) {
		const idx = layers.findIndex((layer) => layer.id == i);
		const keep = layers.filter((layer) => layer.id != i);
		layers = [...keep];
		if (selectedLayerId == i) {
			if (layers[idx]) {
				selectedLayerId = layers[idx].id;
			} else if (layers.length > 0) {
				selectedLayerId = layers[layers.length - 1].id;
			} else {
				selectedLayerId = -1;
			}
		}
	}

	function handleClickAlignLeft() {
		if (current) {
			current.x = 0;
		}
	}

	function handleClickAlignCenter() {
		if (current) {
			current.x = Math.floor((canvasWidth - current.width) / 2);
		}
	}

	function handleClickAlignRight() {
		if (current) {
			current.x = canvasWidth - current.width;
		}
	}

	function handleClickAlignTop() {
		if (current) {
			current.y = 0;
		}
	}

	function handleClickAlignMiddle() {
		if (current) {
			current.y = Math.floor((canvasHeight - current.height) / 2);
		}
	}

	function handleClickAlignBottom() {
		if (current) {
			current.y = canvasHeight - current.height;
		}
	}

	function handleClickFitWidth() {
		if (current) {
			current.x = 0;
			current.width = canvasWidth;
		}
	}

	function handleClickFitHeight() {
		if (current) {
			current.y = 0;
			current.height = canvasHeight;
		}
	}

	$: if (selectedLayerId >= 0) {
		current = layers.find((layer) => layer.id == selectedLayerId);
	} else {
		current = undefined;
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
		<Heading class="flex items-center mb-2" customSize="text-lg" tag="h2">
			プレビュー
			<Secondary class="flex ml-8">
				<Button size="sm" on:click={updatePreview}>更新</Button>
				<Checkbox class="ml-8" bind:checked={autoPreviewUpdate}>自動更新</Checkbox>
			</Secondary>
		</Heading>

		<div class="flex-1" bind:this={elDiv}>
			{#if canvasData}
				<img
					class="border border-gray-200  h-auto mx-auto preview"
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
			<div class="flex mt-2">
				<div class="flex-1 px-2">
					<NumberInput label="幅" id="canvas_width" min="1" max="2000" bind:value={canvasWidth} />
				</div>
				<div class="flex-1 px-2">
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
			<Button disabled={layers.length == 0}>画像をダウンロード</Button>
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
					{#each layers as layer (layer.id)}
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
							<button class="btn-icon btn-danger" on:click={() => handleClickTrash(layer.id)}>
								<Icon icon="mdi:trash" height="auto" />
							</button>
							<Tooltip style="light">{layer.name}を削除</Tooltip>
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
				<div class="flex items-center">
					<Label for="name">名称</Label>
					<Input size="sm" id="name" class="ml-2 flex-1" bind:value={current.name} />
				</div>
				<!-- type -->
				<div class="flex items-center mt-2">
					<Label for="type">形状</Label>
					<Select size="sm" id="type" class="ml-2 flex-1" items={types} bind:value={current.type} />
				</div>
				{#if current.type == LayerType.Rectangle}
					<!-- 塗りつぶし -->
					<PropertyBlock name="塗りつぶし">
						<div slot="props" class="ml-2">
							<ColorInput id="bg_color" bind:color={current.bgColor} bind:alpha={current.bgAlpha} />
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.bgColor} / {current.bgAlpha}%
						</Span>
					</PropertyBlock>

					<!-- 枠線 -->
					<PropertyBlock name="枠線">
						<div slot="props" class="ml-2">
							<ColorInput
								id="border_color"
								bind:color={current.lineColor}
								bind:alpha={current.lineAlpha}
							/>
							<NumberInput
								label="太さ"
								id="border_width"
								min="0"
								max="100"
								bind:value={current.lineWidth}
							/>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.lineWidth}px {current.lineColor} / {current.lineAlpha}%
						</Span>
					</PropertyBlock>

					<!-- サイズ -->
					<PropertyBlock name="サイズ">
						<div slot="props" class="ml-2">
							<div>
								<NumberInput
									labelClass="w-7"
									label="幅"
									id="width"
									min="0"
									max="2000"
									bind:value={current.width}
								>
									<button class="btn-icon ml-2" on:click={handleClickFitWidth}>
										<Icon icon="mdi:arrow-expand-horizontal" height="auto" />
									</button>
									<Tooltip style="light">幅をキャンバスに合わせる</Tooltip>
								</NumberInput>
							</div>
							<div class="mt-1">
								<NumberInput
									labelClass="w-7"
									label="高さ"
									id="height"
									min="-2000"
									max="2000"
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
						<div slot="props" class="ml-2">
							<div>
								<NumberInput label="X" id="x" min="-2000" max="2000" bind:value={current.x}>
									<button class="btn-icon px-2" on:click={handleClickAlignLeft}>
										<Icon icon="mdi:format-horizontal-align-left" height="auto" />
									</button>
									<Tooltip style="light">右寄せ</Tooltip>
									<button class="btn-icon px-2" on:click={handleClickAlignCenter}>
										<Icon icon="mdi:format-horizontal-align-center" height="auto" />
									</button>
									<Tooltip style="light">中央寄せ</Tooltip>
									<button class="btn-icon pl-2" on:click={handleClickAlignRight}>
										<Icon icon="mdi:format-horizontal-align-right" height="auto" />
									</button>
									<Tooltip style="light">左寄せ</Tooltip>
								</NumberInput>
							</div>
							<div class="mt-1">
								<NumberInput label="Y" id="y" min="-2000" max="2000" bind:value={current.y}>
									<button class="btn-icon px-2" on:click={handleClickAlignTop}>
										<Icon icon="mdi:format-vertical-align-top" height="auto" />
									</button>
									<Tooltip style="light">上寄せ</Tooltip>
									<button class="btn-icon px-2" on:click={handleClickAlignMiddle}>
										<Icon icon="mdi:format-vertical-align-center" height="auto" />
									</button>
									<Tooltip style="light">中央寄せ</Tooltip>
									<button class="btn-icon pl-2" on:click={handleClickAlignBottom}>
										<Icon icon="mdi:format-vertical-align-bottom" height="auto" />
									</button>
									<Tooltip style="light">下寄せ</Tooltip>
								</NumberInput>
							</div>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							({current.x} , {current.y})
						</Span>
					</PropertyBlock>

					<!-- シャドウ -->
					<PropertyBlock name="影">
						<div slot="props" class="ml-2">
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
							<div class="mt-1">
								<NumberInput
									label="垂直方向のオフセット"
									id="shadow_offset_y"
									min="-100"
									max="100"
									bind:value={current.shadowOffsetY}
								/>
							</div>
						</div>
						<Span slot="summary" class="font-normal text-sm">
							{current.shadowBlur}px ({current.shadowOffsetX} , {current.shadowOffsetY})
							{current.shadowColor} / {current.shadowAlpha}
						</Span>
					</PropertyBlock>
				{/if}
			</div>
		{/if}
	</div>
</div>

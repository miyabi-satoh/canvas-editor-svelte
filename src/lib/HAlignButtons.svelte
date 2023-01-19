<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let canvasWidth: number;
	export let selfWidth: number = 0;
	export let value: number;

	const dispatch = createEventDispatcher();
	type HAlign = 'left' | 'center' | 'right';
	function onClickDispatch(align: HAlign) {
		dispatch('click', { align });
	}

	function handleClickLeft() {
		value = 0;
		onClickDispatch('left');
	}

	function handleClickCenter() {
		value = Math.floor((canvasWidth - selfWidth) / 2);
		onClickDispatch('center');
	}

	function handleClickRight() {
		value = canvasWidth - selfWidth;
		onClickDispatch('right');
	}
</script>

<div class="flex gap-3">
	<button class="btn-icon" on:click={handleClickLeft}>
		<Icon icon="mdi:format-horizontal-align-left" height="auto" />
	</button>
	<Tooltip style="light">右寄せ</Tooltip>
	<button class="btn-icon" on:click={handleClickCenter}>
		<Icon icon="mdi:format-horizontal-align-center" height="auto" />
	</button>
	<Tooltip style="light">中央寄せ</Tooltip>
	<button class="btn-icon" on:click={handleClickRight}>
		<Icon icon="mdi:format-horizontal-align-right" height="auto" />
	</button>
	<Tooltip style="light">左寄せ</Tooltip>
</div>

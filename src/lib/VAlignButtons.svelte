<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let canvasHeight: number;
	export let selfHeight: number = 0;
	export let value: number;

	const dispatch = createEventDispatcher();
	type VAlign = 'top' | 'middle' | 'bottom';
	function onClickDispatch(align: VAlign) {
		dispatch('click', { align });
	}

	function handleClickTop() {
		value = 0;
		onClickDispatch('top');
	}

	function handleClickMiddle() {
		value = Math.floor((canvasHeight - selfHeight) / 2);
		onClickDispatch('middle');
	}

	function handleClickBottom() {
		value = canvasHeight - selfHeight;
		onClickDispatch('bottom');
	}
</script>

<div class="flex gap-3">
	<button class="btn-icon" on:click={handleClickTop}>
		<Icon icon="mdi:format-vertical-align-top" height="auto" />
	</button>
	<Tooltip style="light">上寄せ</Tooltip>
	<button class="btn-icon" on:click={handleClickMiddle}>
		<Icon icon="mdi:format-vertical-align-center" height="auto" />
	</button>
	<Tooltip style="light">中央寄せ</Tooltip>
	<button class="btn-icon" on:click={handleClickBottom}>
		<Icon icon="mdi:format-vertical-align-bottom" height="auto" />
	</button>
	<Tooltip style="light">下寄せ</Tooltip>
</div>

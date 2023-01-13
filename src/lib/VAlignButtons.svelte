<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';

	export let canvasHeight: number;
	export let selfHeight: number = 0;
	export let value: number;
</script>

<div class="flex gap-3">
	<button class="btn-icon" on:click={() => (value = 0)}>
		<Icon icon="mdi:format-vertical-align-top" height="auto" />
	</button>
	<Tooltip style="light">上寄せ</Tooltip>
	<button class="btn-icon" on:click={() => (value = Math.floor((canvasHeight - selfHeight) / 2))}>
		<Icon icon="mdi:format-vertical-align-center" height="auto" />
	</button>
	<Tooltip style="light">中央寄せ</Tooltip>
	<button class="btn-icon" on:click={() => (value = canvasHeight - selfHeight)}>
		<Icon icon="mdi:format-vertical-align-bottom" height="auto" />
	</button>
	<Tooltip style="light">下寄せ</Tooltip>
</div>

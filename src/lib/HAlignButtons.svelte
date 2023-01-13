<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';

	export let canvasWidth: number;
	export let selfWidth: number = 0;
	export let value: number;
</script>

<div class="flex gap-3">
	<button class="btn-icon" on:click={() => (value = 0)}>
		<Icon icon="mdi:format-horizontal-align-left" height="auto" />
	</button>
	<Tooltip style="light">右寄せ</Tooltip>
	<button class="btn-icon" on:click={() => (value = Math.floor((canvasWidth - selfWidth) / 2))}>
		<Icon icon="mdi:format-horizontal-align-center" height="auto" />
	</button>
	<Tooltip style="light">中央寄せ</Tooltip>
	<button class="btn-icon" on:click={() => (value = canvasWidth - selfWidth)}>
		<Icon icon="mdi:format-horizontal-align-right" height="auto" />
	</button>
	<Tooltip style="light">左寄せ</Tooltip>
</div>

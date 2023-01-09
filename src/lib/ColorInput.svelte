<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import NumberInput from './NumberInput.svelte';

	export let labelClass: string = '';
	export let label: string = '色';
	export let color: string;
	export let alpha: number | undefined = undefined;
	export let id: string;
</script>

<div class="flex items-center">
	<Label class={labelClass} for={id}>{label}</Label>
	<input type="color" class="ml-2" {id} bind:value={color} />
	{#if alpha !== undefined}
		<div class="flex-1 ml-2">
			<NumberInput label="透明度" id="{id}_alpha" min="0" max="100" bind:value={alpha} />
		</div>
	{/if}
</div>

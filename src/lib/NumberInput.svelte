<script lang="ts">
	import { Label, Input, Range } from 'flowbite-svelte';

	export let labelClass: string = '';
	export let label: string;
	export let value: number;
	export let id: string;
	export let min: string | number;
	export let max: string | number;
	export let withRange = true;
</script>

<div class="flex items-center gap-2">
	<Label for={id} class={labelClass}>{label}</Label>
	<div class="w-16">
		<Input size="sm" type="number" {id} {min} {max} bind:value />
	</div>
	{#if withRange}
		<div class="flex-1">
			<Range {min} {max} bind:value />
		</div>
	{/if}
	<slot />
</div>

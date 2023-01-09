<script lang="ts">
	import { Label, Input, Range } from 'flowbite-svelte';

	export let labelClass: string = '';
	export let label: string;
	export let value: number;
	export let id: string;
	export let min: string | number;
	export let max: string | number;
</script>

<div class="flex items-center">
	<Label for={id} class={labelClass}>{label}</Label>
	<div class="w-16 mx-2">
		<Input size="sm" type="number" {id} {min} {max} bind:value />
	</div>
	<div class="flex-1">
		<Range {min} {max} bind:value />
	</div>
	<slot />
</div>

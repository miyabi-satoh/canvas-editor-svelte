<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Heading, Secondary } from 'flowbite-svelte';

	export let open: boolean = false;
	export let name: string;
	let elScrollTo: HTMLElement | undefined;

	$: if (elScrollTo) {
		elScrollTo.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	}
	$: if (!open) {
		elScrollTo = undefined;
	}
</script>

<button class="w-full" on:click={() => (open = !open)}>
	<Heading tag="h4" class="flex gap-2 items-center" customSize="text-sm mt-2">
		<Secondary>
			{#if open}
				<Icon icon="mdi:chevron-down" height="auto" />
			{:else}
				<Icon icon="mdi:chevron-right" height="auto" />
			{/if}
		</Secondary>
		{name}
		{#if !open}
			<Secondary>
				<slot name="summary" />
			</Secondary>
		{/if}
	</Heading>
</button>
{#if open}
	<slot name="props" />
	<div bind:this={elScrollTo} />
{/if}

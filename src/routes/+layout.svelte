<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		NavHamburger,
		DarkMode,
		Footer,
		FooterCopyright
	} from 'flowbite-svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Canvas Editor</title>
</svelte:head>
<div class="h-screen flex flex-col">
	<Navbar>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Canvas Editor v2
			</span>
		</NavBrand>
		<div class="flex">
			<DarkMode />
		</div>
	</Navbar>
	<main class="flex flex-1 min-h-0 border-y border-slate-500 justify-center">
		<div class="flex container">
			<slot />
		</div>
	</main>
	<Footer footerType="custom" customClass="p-2 bg-white rounded-lg shadow dark:bg-gray-800">
		<FooterCopyright href="/" by="amiiby.com" />
	</Footer>
</div>

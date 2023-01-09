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
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Canvas Editor
			</span>
		</NavBrand>
		<div class="flex md:order-2">
			<DarkMode />
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
		</NavUl>
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

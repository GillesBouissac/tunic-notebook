<script>
	import '../app.css';
	import Sidebar from '$lib/layout/Sidebar.svelte'
	import Navbar from '$lib/layout/Navbar.svelte'

	let open = $state(false);
	let { children } = $props();
	let mainClass = $derived(open ? "lg:ml-40" : "");

</script>

<svelte:head>
    <title>Tunic notebook</title> 
	<link rel="icon" href="http://localhost:5173/favicon.ico">
</svelte:head>

<Navbar />
<Sidebar bind:open={open}/>
<div class="flex px-4 mx-auto w-full">
	<main class="{mainClass} w-full mx-auto">
		{@render children()}
	</main>
</div>

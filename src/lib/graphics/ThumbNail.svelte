<script lang="ts">
    import { A, Modal } from "flowbite-svelte";

    let { imageName }:{imageName: string} = $props();
    let zoom = $state(false);
</script>

<div class="thumbnail-container">
    <A onclick={() => {zoom=true}}>
        <img alt="{imageName}" src="/api/screenshots/{imageName}" class="mx-auto"/>
    </A>
</div>
<Modal bind:open={zoom} size="xl">
    <img class="mx-auto" alt="{imageName}" src="/api/screenshots/{imageName}"/>
</Modal>

<style>
    .thumbnail-container {
        position: relative;
    }
</style>

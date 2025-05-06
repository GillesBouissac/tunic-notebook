<script>
    import { pzoom } from '$lib/panzoom/pzoom'

    /** @type {{ imageName: string }} */
    let { imageName } = $props();

    /** @type {HTMLElement} */
    // @ts-ignore
    let zoomable = $state();

</script>

<div class="thumbnail-container h-full">
    <div class="zoomable" min-scale="0.2" bind:this={zoomable} use:pzoom={{panAnywhere:true}}>
        <img alt="{imageName}" src="/api/screenshots/{imageName}"/>
    </div>
</div>

<style>
    .thumbnail-container {
		height: 100%;
		width: 100%;
        position: relative;
        overflow: hidden;
        background-color: #eee;
        cursor: grab;
    }
	.zoomable {
		height: 100%;
		width: 100%;
		position: absolute;
        display: flex;
		flex-wrap: nowrap;
		justify-content: space-evenly;
        align-content: center;
        align-items: center;
	}
</style>

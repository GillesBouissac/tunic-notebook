<script>
    /** @type {{ imageName: string, navigateFrom?: function (string): void }} */
    let { imageName, navigateFrom } = $props();

    let documentName = imageName ? imageName.substring(0, imageName.lastIndexOf(".")) + ".json" : undefined;

    function beforeNavigate() {
        if (navigateFrom ) {
            navigateFrom(imageName);
        }
    }
</script>

{#if documentName}
<div class="thumbnail-container">
    <a href="/gallery/image?name={imageName}" onclick={beforeNavigate}>
        <img alt="{imageName}" src="/api/screenshots/{imageName}" class="mx-auto"/>
    </a>
</div>
{/if}

<style>
    .thumbnail-container {
        position: relative;
    }
</style>

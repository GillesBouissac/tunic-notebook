<script>
    import Fa from "svelte-fa";
    import { faBook, faMaximize } from "@fortawesome/free-solid-svg-icons";
    import { GradientButton  } from 'flowbite-svelte';

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
    <div class="goto-document">
        <GradientButton shadow pill={true} class="p-2!" color="cyan" href="/document-editor/{documentName}/" onclick={beforeNavigate}>
            <Fa icon={faBook} />
        </GradientButton>
        <GradientButton shadow pill={true} class="p-2!" color="lime" href="/api/screenshots/{imageName}" target={imageName}>
            <Fa icon={faMaximize} />
        </GradientButton>
    </div>
</div>
{/if}

<style>
    .thumbnail-container {
        position: relative;
    }
    .goto-document {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
</style>

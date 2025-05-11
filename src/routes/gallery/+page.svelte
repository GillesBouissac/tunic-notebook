<script lang="ts">
  import Fa from "svelte-fa";
  import { faPencil } from "@fortawesome/free-solid-svg-icons";
  import { marked } from "marked";
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { decodeSymbols } from "$lib/model/model.svelte";
  import { Button } from "flowbite-svelte";
  import { NoteTooltip, ThumbNail } from "$lib/graphics/graphics.svelte";

  let { data } = $props();
  let alphabet = data.alphabet;
  let notebooks = data.notebooks;

  const activeDocument = $state(page.url.searchParams.get('document'));

  /** Callback called before we leave the page */
  async function navigateFrom(doc: string) {
    return goto(`#${doc}`);
  }

  /** Callback called to redirect to a document editor */
  function editNotebook(doc:string) {
    return () => {
      navigateFrom(doc).then(() => goto(`/document-editor/${doc}/`));
    }
  }

  marked.use(markedTunic({ alphabet: alphabet.items, decode:decodeSymbols }));
</script>

{#if alphabet}
<div class="grid grid-cols-1 gap-4 mx-auto">
	{#each notebooks as notebook}
    <div id="{notebook.documentfile}" class="grid grid-cols-4 gap-4 mx-auto">
      <div class="flex items-center thumbnail-container rounded-lg">
        <div class="m-3"><ThumbNail imageName={notebook.imagefile}></ThumbNail></div>
      </div>
      <div class="relative marked-local col-span-3 rounded-lg">
        <div class="marked-styles m-3">{@html marked(notebook.documentcontent)}</div>
        <div class="button-box">
          <Button shadow class="px-4" color="blue" onclick={editNotebook(notebook.documentfile)}>
            <Fa icon={faPencil} /><span>&nbsp;Edit</span>
          </Button>
          <NoteTooltip placement="left">Edit the note in note editor</NoteTooltip>
        </div>
      </div>
    </div>
  {/each}
</div>
{/if}

<style>
  .marked-local {
    background-color: #eee;
  }
  .thumbnail-container {
    background-color: #eee;
  }
  .button-box {
      position: absolute;
      top: 10px;
      right: 10px;
  }
</style>

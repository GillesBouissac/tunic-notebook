<script>
  import Fa from "svelte-fa";
  import { faPencil } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { Notebook, Alphabet } from "$lib/model/model.svelte";
  import { Button } from "flowbite-svelte";
  import { NoteTooltip, ThumbNail } from "$lib/graphics/graphics.svelte";

  /** @type {{imagefile:string, documentfile:string, documentcontent:string}[]} */
  let documents = $state([]);

  /** @type {Alphabet|undefined} */
  let alphabet = $derived(undefined);

  const activeDocument = page.url.searchParams.get('document');

  async function fetchData() {
    const answer = await fetch("/api/screenshots/list");
    const imagenames = await answer.json();
    for ( const imagefile of imagenames ) {
      const basename = imagefile.replace(/\.[^/.]+$/, "");
      const jsonfile = `${basename}.json`;
      let document = await Notebook.download(jsonfile);
      if (!document) {
        document = Notebook.newDocument(jsonfile, imagefile);
        await document.upload();
      }
      documents.push({
        imagefile:imagefile,
        documentfile:jsonfile,
        documentcontent:document.text.length==0 ? "Use edit button to add notes" : document.text
      });
    }
    if (!alphabet) {
      alphabet = await Alphabet.download();
      marked.use(markedTunic({ alphabet: alphabet?.items }));
    }
  }

  /**
   * Create an observer to detect visibility change of sections
   * @param node {Element} The element to observe
   */
  function onSectionCreated(node) {
    if (activeDocument) {
      let element = document.getElementById(activeDocument);
      // console.log("scrolling view to ", element);
      if (element) {
        element.scrollIntoView({block:"center"});
      }
    }
  }

  /**
   * Callback called before we leave the page
   * @param imagefile {string}
   * @return {Promise<void>}
   */
  async function navigateFrom(imagefile) {
    return goto(`?document=${imagefile}`);
  }

  /**
   * Callback called to redirect to a document editor
   * @param imagefile {string}
   * @param documentfile {string}
   */
  function navigateTo(imagefile, documentfile) {
    return () => {
      navigateFrom(imagefile).then(() => goto(`/document-editor/${documentfile}/`));
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

{#if alphabet}
<div class="grid grid-cols-1 gap-4 mx-auto">
	{#each documents as document}
    <div id="{document.imagefile}" use:onSectionCreated class="grid grid-cols-4 gap-4 mx-auto">
      <div class="flex items-center thumbnail-container">
        <div class="m-3"><ThumbNail imageName={document.imagefile} {navigateFrom}></ThumbNail></div>
      </div>
      <div class="relative marked-local col-span-3">
        <div class="marked-styles m-3">{@html marked(document.documentcontent)}</div>
        <div class="button-box">
          <Button shadow class="px-4" color="blue" onclick={navigateTo(document.imagefile, document.documentfile)}>
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

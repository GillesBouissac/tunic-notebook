<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ThumbNail from "$lib/layout/ThumbNail.svelte";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { Notebook, Alphabet } from "$lib/model/model.svelte";
  /** @typedef {import("$lib/marked/marked-tunic.svelte").TunicOptions} TunicOptions */

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
      const answer = await fetch(`/api/documents/${jsonfile}`);
      let document = new Notebook();
      if (answer.ok) {
        document = Notebook.parseJSON(await answer.text());
      }
      documents.push({
        imagefile:imagefile,
        documentfile:jsonfile,
        documentcontent:document.text.length==0 ? "Click to add notes" : document.text
      });
    }
    if (!alphabet) {
      alphabet = await Alphabet.download();
      /** @type {TunicOptions} */
      const options = {
    	  alphabet: alphabet?.items
      };
      marked.use(markedTunic(options));
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
   * @return {Promise<void>}
   */
  async function navigateTo(imagefile, documentfile) {
    return navigateFrom(imagefile)
      .then(() => goto(`/document-editor/${documentfile}/`));
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
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="marked-local col-span-3" onclick={() => {navigateTo(document.imagefile, document.documentfile)}}>
        <div class="marked-styles m-3">{@html marked(document.documentcontent)}</div>
      </div>
    </div>
  {/each}
</div>
{/if}

<style>
  .marked-local {
    background-color: #eee;
    cursor: pointer;
  }
  .thumbnail-container {
    background-color: #eee;
  }
</style>

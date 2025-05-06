<script>
  import { page } from '$app/state';
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { Textarea } from "flowbite-svelte";
  import { SymbolDocument, Alphabet, SymbolBean } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import SymbolInteractive from "$lib/graphics/SymbolInteractive.svelte";
  import ImagePanZoom from "$lib/panzoom/ImagePanZoom.svelte";

  /** @typedef {import("$lib/marked/marked-tunic.svelte").TunicOptions} TunicOptions */

  /** @type {string|null} */
  let documentName = page.params.fileName;

  /** @type {SymbolDocument|null} */
  let textdoc = $derived(null);

  /** @type {Alphabet|undefined} */
  let alphabet = $derived(undefined);

  /** @type {number} */
  let nbRowInitial = $state(5);

  let bean = new SymbolBean(0xFFFF);

  async function fetchData() {
    if (documentName) {
      let newdoc = await SymbolDocument.fetch(documentName);
      if (!newdoc) {
        newdoc = new SymbolDocument();
        newdoc.fileName = documentName;
        newdoc.title = documentName ? documentName : "New Document";
        newdoc.image = documentName?.substring(0, documentName?.lastIndexOf(".")) + ".jpg";
        newdoc.text = "";
        newdoc.save();
      }
      if (newdoc) {
        textdoc = newdoc;
      }
      nbRowInitial = (textdoc?.text.match(/\n/g) || []).length
    }
    if (!alphabet) {
      alphabet = await Alphabet.fetch("alphabet");
      /** @type {TunicOptions} */
      const options = {
    	  alphabet: alphabet?.items
      };
      marked.use(markedTunic(options));
    }
  }

  $effect(() => {
    saveDocument(textdoc?.text)
  });

  /** @param {string | undefined} text */
  async function saveDocument(text) {
    textdoc?.save();
  }

  /** @param {KeyboardEvent} event */
  function handleKeyDown (event) {
    // @ts-ignore
    if (event.target?.id=="text-editor") {
      if (event.key == "Tab") {
        event.preventDefault();
        document.execCommand("insertText", false, '\t');
      }
      console.log("In text editor");
    }
  }

  onMount(() => {
    fetchData();
  });

</script>

<svelte:window on:keydown={handleKeyDown}/>
{#if textdoc && alphabet}
<div class="grid grid-cols-2 w-full">

  <div class="m-2 h-full">
    <div class="grid grid-cols-2 w-full m-2">
      <div class="mx-auto w-full">
        <ImagePanZoom imageName={textdoc.image}></ImagePanZoom>
      </div>
      <div class="flex items-center justify-items-center h-full">
        <SymbolInteractive {bean} segmentWidth={2.5} svgClass="image-box"/>
      </div>
    </div>

    <div>
      <Textarea id="text-editor" class="text-box" bind:value={textdoc.text}></Textarea>
    </div>
  </div>

  <div class="marked-styles marked-box overflow-auto m-2">
    {@html marked(textdoc.text)}
  </div>

</div>

{:else}
  <div class="flex h-full w-full">
    <text class="h-100 w-full text-center content-center">Edit document '{documentName}'</text>
  </div>
{/if}

<style>
  :global(.image-box) {
    height: 30dvh;
  }
  :global(.text-box) {
    height: 60dvh;
  }
  :global(.marked-box) {
    max-height: 90dvh;
  }
</style>


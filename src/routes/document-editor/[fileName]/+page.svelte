<script>
  import Fa from 'svelte-fa';
  import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/state';
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { GradientButton } from "flowbite-svelte";
  import { Notebook, Alphabet, SymbolBean } from "$lib/model/model.svelte";
  import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { SymbolInteractive } from "$lib/graphics/graphics.svelte";
  import ImagePanZoom from "$lib/panzoom/ImagePanZoom.svelte";
  import { NoteTooltip } from '$lib/graphics/graphics.svelte';

  /** @typedef {import("$lib/marked/marked-tunic.svelte").TunicOptions} TunicOptions */

  /** @type {string|null} */
  let documentName = page.params.fileName;

  /** @type {Notebook|null} */
  let textdoc = $derived(null);

  /** @type {Alphabet|undefined} */
  let alphabet = $derived(undefined);

  /** @type {HTMLTextAreaElement|undefined} */
  let textarea = $state();
  
  let bean = new SymbolBean(0xFFFF);

  async function fetchData() {
    if (documentName) {
      let newdoc = await Notebook.download(documentName);
      if (!newdoc) newdoc = new Notebook(documentName);
      if (newdoc)  textdoc = newdoc;
    }
    if (!alphabet) {
      alphabet = await Alphabet.download();
      marked.use(markedTunic({alphabet: alphabet?.items}));
    }
  }

  $effect(() => {
    saveDocument(textdoc?.text)
  });

  /** @param {string | undefined} text */
  function saveDocument(text) {
    textdoc?.upload();
  }

  /**
   * Insert text in textArea at current position
   * @param text {string}
   */
  function insertText (text) {
    if (textarea) {
      textarea.focus();
      document.execCommand("insertText", false, text);
    }
  };

  /** @param {KeyboardEvent} event */
  function handleKeyDown (event) {
    if (event.key == "Tab") {
      insertText('\t');
      event.preventDefault();
    }
  }

  function onButtonInsertSymbol() {
    insertText(`tunic(0x${bean.code.toString(16).toUpperCase()})`);
  }

  onMount(() => {
    fetchData();
  });

</script>

{#if textdoc && alphabet}
<div class="grid grid-cols-2 w-full">

  <div class="m-2 h-full">
    <div class="relative grid grid-cols-2 w-full m-2">
      <div class="mx-auto w-full">
        <ImagePanZoom imageName={textdoc.image}></ImagePanZoom>
        <NoteTooltip arrow={false} placement="right-start">You can pan and zoom this image to focus on symbols</NoteTooltip>
      </div>
      <div class="flex items-center justify-center h-full">
        <SymbolInteractive {bean} segmentWidth={2.5} svgClass="image-box"/>
      </div>
      <NoteTooltip placement="bottom">Use this tool to reproduce a symbol you see in image</NoteTooltip>
      <div class="button-box">
        <GradientButton shadow class="p-2!" color="blue" onclick={onButtonInsertSymbol}>
            <Fa icon={faFileArrowDown} /><span>&nbsp;Insert</span>
        </GradientButton>
        <NoteTooltip placement="bottom">Insert the displayed symbol in the document at current position.<br>Can be undone using &lt;Ctrl&gt;+Z</NoteTooltip>
      </div>
    </div>

    <div>
      <textarea bind:this={textarea} class="text-box" bind:value={textdoc.text} onkeydown={handleKeyDown}></textarea>
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
    height: 58dvh;
    width: 100%;
  }
  :global(.marked-box) {
    max-height: 90dvh;
  }
  .button-box {
      position: absolute;
      bottom: 10px;
      right: 10px;
  }
</style>

<script>
  import Fa from 'svelte-fa';
  import { faFileArrowDown, faKey } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/state';
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { Button, Toggle } from "flowbite-svelte";
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

  /** @type {boolean} */
  let decodeSymbols = $state(true);

  let markedOptions = $state({alphabet: new Map()});

  let bean = new SymbolBean(0xFFFF);

  async function fetchData() {
    if (documentName) {
      textdoc = await Notebook.download(documentName);
    }
    if (!alphabet) {
      alphabet = await Alphabet.download();
      marked.use(markedTunic(markedOptions));
    }
  }

  $effect(() => {
    saveDocument(textdoc?.text)
  });

  $effect(() => {
    if (alphabet) {
      markedOptions.alphabet = decodeSymbols ? alphabet.items : new Map();
    }
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
        <NoteTooltip placement="bottom">You can pan and zoom this image to focus on symbols</NoteTooltip>
      </div>
      <div class="flex items-center justify-center h-full">
        <SymbolInteractive {bean} segmentWidth={2.5} svgClass="image-box"/>
      </div>
      <NoteTooltip placement="bottom">Use this tool to reproduce a symbol you see in image</NoteTooltip>
      <div class="button-box">
        <Button shadow class="px-4" color="blue" onclick={onButtonInsertSymbol}>
            <Fa icon={faFileArrowDown} /><span>&nbsp;Insert</span>
        </Button>
        <NoteTooltip placement="bottom">Insert the displayed symbol in the document at current position.<br>Can be undone using &lt;Ctrl&gt;+Z</NoteTooltip>
      </div>
    </div>

    <div>
      <textarea bind:this={textarea} class="text-box" bind:value={textdoc.text} onkeydown={handleKeyDown}></textarea>
    </div>
  </div>
  <div class="relative">
    <div class="marked-styles marked-box overflow-auto m-2">
      {@html marked(textdoc.text)}
    </div>
    <div class="toggle-box">
      <Toggle class="px-4" color="blue" bind:checked={decodeSymbols}><Fa icon={faKey} /></Toggle>
      <NoteTooltip placement="bottom">{decodeSymbols ? "Symbol decoding active" : "Symbol decoding inactive"}</NoteTooltip>
    </div>
  </div>
</div>

{:else}
  <div class="flex h-full w-full">
    <text class="h-100 w-full text-center content-center">Missing document '{documentName}'</text>
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
  .toggle-box {
      position: absolute;
      top: 20px;
      right: 20px;
  }
</style>

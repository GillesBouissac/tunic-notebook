<script>
  import Fa from 'svelte-fa';
  import { faBatteryEmpty, faBatteryFull, faFileArrowDown, faKey, faRepeat } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/state';
  import { marked } from "marked";
  import { Button, Select, Toggle } from "flowbite-svelte";
  import { decodeSymbols, SymbolBean } from "$lib/model/model.svelte";
  import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { SymbolInteractive } from "$lib/graphics/graphics.svelte";
  import ImagePanZoom from "$lib/panzoom/ImagePanZoom.svelte";
  import { NoteTooltip } from '$lib/graphics/graphics.svelte';
  /** @import { TunicOptions } from '$lib/marked/marked-tunic.svelte' */

  let { data } = $props();
  let alphabet = data.alphabet;
  let notebook = data.notebook;

  /** @type {string|null} */
  let documentName = page.params.fileName;

  /** @type {HTMLTextAreaElement|undefined} */
  let textarea = $state();

  /** @type {{name:string, value: number}[]}} */
  let selectBean =$state([]);

  /** @type {TunicOptions}*/
  let markedOptions = {alphabet: alphabet.items, decode:decodeSymbols};

  /** @type {SymbolBean} */
  let sandboxBean = new SymbolBean(0xFFFF);

  $effect(() => {
    if (alphabet) {
      selectBean = [...alphabet.items.values()].map((v, _) => {
        return {value:v.code, name:v.meaning}
      });
    }
  });

  $effect(() => {
    saveDocument(notebook?.text)
  });

  /** @param {string | undefined} text */
  function saveDocument(text) {
    notebook?.upload();
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
    insertText(`tunic(0x${sandboxBean.code.toString(16).toUpperCase()})`);
  }

  marked.use(markedTunic(markedOptions));
</script>

{#if notebook && alphabet}
<div class="grid grid-cols-2 w-full">

  <div class="m-2 h-full">
    <div class="grid grid-cols-6 w-full m-2">
      <div class="mx-auto w-full col-span-3">
        <ImagePanZoom imageName={notebook.image}></ImagePanZoom>
        <NoteTooltip placement="bottom">You can pan and zoom this image to focus on symbols</NoteTooltip>
      </div>
      <div class="flex items-center justify-center h-full col-span-2">
        <SymbolInteractive bean={sandboxBean} segmentWidth={2.5} svgClass="image-box"/>
      </div>
      <NoteTooltip placement="bottom">Use this tool to reproduce a symbol you see in the image</NoteTooltip>
      <div class="button-bo grid grid-cols-1 p-4">
        <Select class="text-center" placeholder="Alphabet ..." items={selectBean} bind:value={sandboxBean.code}></Select>
        <Button shadow class="px-4 mt-2" color="dark" onclick={() => sandboxBean.code=0x0000}>
          <Fa icon={faBatteryEmpty} /><span>&nbsp;Empty</span>
        </Button>
        <NoteTooltip placement="right">Empties all the segments</NoteTooltip>
        <Button shadow class="px-4 mt-2" color="dark" onclick={() => sandboxBean.code=0xFFFF}>
          <Fa icon={faBatteryFull} /><span>&nbsp;Full</span>
        </Button>
        <NoteTooltip placement="right">Fills all the segments</NoteTooltip>
        <Button shadow class="px-4 mt-2" color="dark" onclick={() => sandboxBean.code=~sandboxBean.code}>
          <Fa icon={faRepeat} /><span>&nbsp;Invert</span>
        </Button>
        <NoteTooltip placement="right">Invert every segment</NoteTooltip>
        <Button shadow class="px-4 mt-2" color="blue" onclick={onButtonInsertSymbol}>
            <Fa icon={faFileArrowDown} /><span>&nbsp;Insert</span>
        </Button>
        <NoteTooltip placement="bottom">Insert the symbol in the document at current position.<br>Can be undone using &lt;Ctrl&gt;+Z</NoteTooltip>
      </div>
    </div>

    <div>
      <textarea bind:this={textarea} class="text-box border-0" bind:value={notebook.text} onkeydown={handleKeyDown}></textarea>
    </div>
  </div>
  <div>
    <div class="marked-styles marked-box overflow-auto m-2">{@html marked(notebook.text)}</div>
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
</style>

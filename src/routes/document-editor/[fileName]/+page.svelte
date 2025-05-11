<script lang="ts">
  import { page } from '$app/state';
  import Fa from 'svelte-fa';
  import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
  import { Marked } from "marked";
  import { Button, Select } from "flowbite-svelte";
  import { decodeSymbols, SymbolBean } from "$lib/model/model.svelte";
  import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { SymbolInteractive } from "$lib/graphics/graphics.svelte";
  import ImagePanZoom from "$lib/panzoom/ImagePanZoom.svelte";
  import { NoteTooltip } from '$lib/graphics/graphics.svelte';
  import { onMount } from 'svelte';

  let { data } = $props();
  let alphabet = data.alphabet;
  let notebook = $derived(data.notebook);
  let documentName = $derived(data.document);
  let textarea:HTMLTextAreaElement|undefined = $state();
  let selectBean:{name:string, value: number}[] =$state([]);
  let sandboxBean: SymbolBean = new SymbolBean(0xFFFF);
  let markedDocument: Marked = new Marked(markedTunic({alphabet: alphabet.items, decode:decodeSymbols}));
  let markedShortcuts: Marked = new Marked(markedTunic({urls:false}));
  let fastShapes=[0x0, 0xF77F, 0x312B, 0x5050, 0x605, 0x2022, 0x108, 0x46, 0x3200, 0x6400, 0x55, 0x5600, 0x2432, 0x2262, 0x510D];
  let selectStart = page.url.searchParams.get("selectStart");
  let selectLenth = page.url.searchParams.get("selectLenth");

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

  function saveDocument(text:string|undefined) {
    notebook?.upload();
  }

  /** Insert text in textArea at current position */
  function insertText (text:string) {
    if (textarea) {
      textarea.focus();
      // Deprecated yes, but for now we need this to add the insertion
      //   into the undo list (Ctrl+Z) of the browser.
      document.execCommand("insertText", false, text);
    }
  };

  function handleKeyDown (event:KeyboardEvent) {
    if (event.key == "Tab") {
      insertText('\t');
      event.preventDefault();
    }
  }

  function onFastShape(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }, code: number) {
    if (e.shiftKey) {
      sandboxBean.code |= code;
    }
    else {
      sandboxBean.code = code;
    }
  }

  function onButtonInsertSymbol() {
    insertText(`tunic(0x${sandboxBean.code.toString(16).toUpperCase()})`);
  }

  onMount(() => {
    if (selectStart && selectLenth) {
      let start = parseInt(selectStart);
      let end = start + parseInt(selectLenth);
      textarea?.setSelectionRange(start, end, "forward");
      textarea?.focus();
    }
  });

</script>

{#if notebook && alphabet}
<div class="grid grid-cols-2 w-full">

  <div class="p-2 h-full">
    <div class="grid grid-cols-6 w-full p-2">
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

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="button-box flex flex-wrap my-4 p-0">
          {#each fastShapes as fastShape}
            <div class="mx-1" onclick={(e) => {onFastShape(e, fastShape)}}>
              {@html markedShortcuts.parse(`tunic(${fastShape})`)}
            </div>
          {/each}
        </div>
        <NoteTooltip placement="right">&lt;click&gt; to set the symbol with this shape<br>&lt;Shift&gt;&lt;click&gt; to add this shape to the symbol</NoteTooltip>

        <Button shadow class="px-4 mt-2" color="blue" onclick={onButtonInsertSymbol}>
            <Fa icon={faFileArrowDown} /><span>&nbsp;Insert</span>
        </Button>
        <NoteTooltip placement="bottom">Insert the symbol in the document at current position.<br>Can be undone using &lt;Ctrl&gt;+Z</NoteTooltip>
      </div>
    </div>

    <div class="m-0">
      <textarea bind:this={textarea} class="text-box border-0" bind:value={notebook.text} onkeydown={handleKeyDown}></textarea>
    </div>
  </div>
  <div class="marked-box p-2">
    <div class="marked-styles marked-box overflow-auto">{@html markedDocument.parse(notebook.text)}</div>
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
  .text-box {
    height: 52dvh;
    width: 100%;
  }
  .marked-box {
    max-height: 90dvh;
  }
</style>

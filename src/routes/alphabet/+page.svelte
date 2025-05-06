<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { Alphabet } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";

  /** @type {Alphabet|undefined} */
  let alphabet;

  async function fetchData() {
    alphabet = await Alphabet.fetch("alphabet");
  }

  async function saveDocument() {
    alphabet?.save();
  }

  marked.use(markedTunic({}));
  onMount(() => {
    fetchData();
  });

</script>

{#if alphabet}
<!-- div class="grid grid-cols-10 w-full" -->
<div class="flex flex-wrap my-6">
  {#each alphabet.items as [_, bean]}
    <div>
      <div class="flex items-center justify-items-center">
        <div class="symbol mx-2">{@html marked(`tunic(${bean.code})`)}</div>
        <div class="m-2 w-14">{bean.meaning}</div>
      </div>
    </div>
  {/each}
</div>
{/if}

<style>
  .symbol {
    --icon-size: 4rem;
  }
</style>


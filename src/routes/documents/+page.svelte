<script>
  import { ThumbNail } from "$lib/graphics/graphics.svelte";
  import { onMount } from "svelte";

  /**
   * @type {String[]}
   */
  let documents;

  async function fetchData() {
    const response = await fetch("/api/documents/list");
    documents = await response.json();
  }

  onMount(() => {
    fetchData();
  });
</script>

<div class="grid grid-cols-3 gap-4 mx-auto">
	{#each documents as screenshot}
    <ThumbNail imageName={screenshot}></ThumbNail>
	{/each}
</div>

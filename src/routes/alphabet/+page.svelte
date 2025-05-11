<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow } from "flowbite-svelte";
  import { marked } from "marked";
  import { SymbolBean } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { SortableHead, SortableHeadCell } from "$lib/graphics/graphics.svelte.js";

  let { data } = $props();
  let alphabet = data.alphabet;
  let stats = data.stats;
  let items:{bean:SymbolBean, singlewords:number, singlefile:number, allwords:number}[] = $state([]);

  function onMeaningChanged(bean: SymbolBean) {
    return async () => {
      if (bean.meaning == "") {
        await alphabet.deletePersistent(bean);
      }
      else {
        await alphabet.addPersistent(bean);
      }
    }
  }

  items = [...stats.items.entries()].map((entry) => {
    let b = alphabet.items.get(entry[0]);
    let allwords = 0;
    let wordRefs = stats.wordsRef(entry[0]);
    Object.keys(wordRefs).forEach((name) => {
      allwords += wordRefs[name] ? wordRefs[name].length : 0;
    })
    return {
      bean:b ? b : new SymbolBean(entry[0]),
      singlewords:Object.keys(stats.wordsRef(entry[0])).length,
      singlefile:Object.keys(stats.filesRef(entry[0])).length,
      allwords:allwords
    }
  });

  marked.use(markedTunic({}));
</script>

<Table hoverable={true} class="text-center table-90">
  <SortableHead class="sticky top-0" applySort={(itemCmp) => items.sort(itemCmp)}>
    {#snippet sortableHeadCells(sortContext)}
      <SortableHeadCell {sortContext} sort={(a,b) => a.bean.code - b.bean.code}>Symbol</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.bean.code - b.bean.code}>Code</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.bean.meaning.localeCompare(b.bean.meaning)}>Meaning</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.singlewords - b.singlewords}>Nb different words</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.singlefile - b.singlefile}>Nb different files</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.allwords - b.allwords}>Nb occurences</SortableHeadCell>
    {/snippet}
  </SortableHead>
  <TableBody class="overflow-auto">
    {#each items as item}
      <TableBodyRow>
        <TableBodyCell>{@html marked(`tunic(${item.bean.code})`)}</TableBodyCell>
        <TableBodyCell>{item.bean.codeString}</TableBodyCell>
        <TableBodyCell class="meaning">
          <input class="w-100 text-fuchsia-600 placeholder-fuchsia-200" onchange={onMeaningChanged(item.bean)} bind:value={item.bean.meaning} placeholder="Give it to me ..." />
        </TableBodyCell>
        {#if stats}
          <TableBodyCell>{item.singlewords}</TableBodyCell>
          <TableBodyCell>{item.singlefile}</TableBodyCell>
          <TableBodyCell>{item.allwords}</TableBodyCell>
        {/if}
      </TableBodyRow>
    {/each}
  </TableBody>  
</Table>



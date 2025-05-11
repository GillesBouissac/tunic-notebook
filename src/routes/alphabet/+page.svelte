<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow } from "flowbite-svelte";
  import { marked } from "marked";
  import { SymbolBean } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { SortableHead, SortableHeadCell } from "$lib/graphics/graphics.svelte.js";

  let { data } = $props();
  let alphabet = data.alphabet;
  let stats = data.stats;
  let beans: SymbolBean[] = $state([]);

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

  let beanIndexed: Map<number,SymbolBean> = new Map()
  beanIndexed = new Map(alphabet.items);
  stats.items.forEach((_,code) => {
    if (!beanIndexed.has(code)){
      beanIndexed.set(code, new SymbolBean(code));
    }
  });
  beans = [...beanIndexed.values()];

  marked.use(markedTunic({}));
</script>

<Table hoverable={true} class="text-center table-90">
  <SortableHead class="sticky top-0" applySort={(itemCmp) => beans.sort(itemCmp)}>
    {#snippet sortableHeadCells(sortContext)}
      <SortableHeadCell {sortContext} sort={(a,b) => a.code - b.code}>Symbol</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.code - b.code}>Code</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => a.meaning.localeCompare(b.meaning)}>Meaning</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => Object.keys(stats.wordsRef(a.code)).length - Object.keys(stats.wordsRef(b.code)).length}>Word count</SortableHeadCell>
      <SortableHeadCell {sortContext} sort={(a,b) => Object.keys(stats.filesRef(a.code)).length - Object.keys(stats.filesRef(b.code)).length}>File count</SortableHeadCell>
    {/snippet}
  </SortableHead>
  <TableBody class="overflow-auto">
    {#each beans as bean}
      <TableBodyRow>
        <TableBodyCell>{@html marked(`tunic(${bean.code})`)}</TableBodyCell>
        <TableBodyCell>{bean.codeString}</TableBodyCell>
        <TableBodyCell class="meaning">
          <input class="w-100 text-fuchsia-600 placeholder-fuchsia-200" onchange={onMeaningChanged(bean)} bind:value={bean.meaning} placeholder="Give it to me ..." />
        </TableBodyCell>
        {#if stats}
          <TableBodyCell>{Object.keys(stats.wordsRef(bean.code)).length}</TableBodyCell>
          <TableBodyCell>{Object.keys(stats.filesRef(bean.code)).length}</TableBodyCell>
        {/if}
      </TableBodyRow>
    {/each}
  </TableBody>  
</Table>



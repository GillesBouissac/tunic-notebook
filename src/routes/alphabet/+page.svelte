<script>
  import { marked } from "marked";
  import { SymbolBean } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";

  let { data } = $props();
  let alphabet = data.alphabet;
  let stats = data.stats;

  /** @type {SymbolBean[]} */
  let beans = $state([]);

  const Column = {
    symbol: "symbol",
    code: "code",
    meaning: "meaning",
    wordcount: "wordcount",
    filecount: "filecount",
  }
  /** @type {Map<string, function (SymbolBean,SymbolBean): number>} */
  const sortfn = new Map([
    [ "symbol", (a, b) => a.code - b.code ],
    [ "code", (a, b) => a.code - b.code ],
    [ "meaning", (a, b) => a.meaning.localeCompare(b.meaning) ],
    [ "wordcount", (a, b) => Object.keys(stats.wordsRef(a.code)).length - Object.keys(stats.wordsRef(b.code)).length ],
    [ "filecount", (a, b) => Object.keys(stats.filesRef(a.code)).length - Object.keys(stats.filesRef(b.code)).length ],
  ]);
  let sortColumn = $state("");
  let sortClass = $state("table-column-sort-asc");

  /** @param {string} col */
  function onSort(col) {
    return () => {
      sortColumn = col;
      sortClass = sortClass=="table-column-sort-asc" ? "table-column-sort-dsc" : "table-column-sort-asc";
      let sign = sortClass=="table-column-sort-asc" ? +1 : -1;
      let cursortfn = sortfn.get(col);
      if (cursortfn) {
        beans.sort((a,b) => sign * cursortfn(a,b));
      }
    }
  }

  /** @param {SymbolBean} bean */
  function onMeaningChanged(bean) {
    return async () => {
      if (bean.meaning == "") {
        await alphabet.deletePersistent(bean);
      }
      else {
        await alphabet.addPersistent(bean);
      }
    }
  }

  /** @type {Map<number,SymbolBean>} */
  let beanIndexed = new Map()
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
  <TableHead class="sticky top-0">
    <TableHeadCell class={sortColumn==Column.symbol ? sortClass : "table-column-sort-none"} onclick={onSort(Column.symbol)}>Symbol</TableHeadCell>
    <TableHeadCell class={sortColumn==Column.code ? sortClass : "table-column-sort-none"} onclick={onSort(Column.code)}>Code</TableHeadCell>
    <TableHeadCell class={sortColumn==Column.meaning ? sortClass : "table-column-sort-none"} onclick={onSort(Column.meaning)}>Meaning</TableHeadCell>
    <TableHeadCell class={sortColumn==Column.wordcount ? sortClass : "table-column-sort-none"} onclick={onSort(Column.wordcount)}>Word count</TableHeadCell>
    <TableHeadCell class={sortColumn==Column.filecount ? sortClass : "table-column-sort-none"} onclick={onSort(Column.filecount)}>File count</TableHeadCell>
  </TableHead>
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



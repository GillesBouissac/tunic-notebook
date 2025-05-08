<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { Alphabet, NotebookStatistics, SymbolBean, TokenLocation } from "$lib/model/model.svelte.js";
	import { markedTunic } from "$lib/marked/marked-tunic.svelte";
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";

  /** @type {Alphabet|undefined} */
  let alphabet = $state(new Alphabet());

  /** @type {NotebookStatistics} */
  let stats = $state(new NotebookStatistics());

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
    [ "wordcount", (a, b) => stats.wordsRef(a.code).length - stats.wordsRef(b.code).length ],
    [ "filecount", (a, b) => stats.filesRef(a.code).length - stats.filesRef(b.code).length ],
  ]);
  let sortColumn = $state("");
  let sortClass = $state("table-column-sort-asc");

  async function fetchData() {
    /** @type {Map<number,SymbolBean>} */
    let beanIndexed = new Map()
    alphabet = await Alphabet.download();
    stats = await NotebookStatistics.download();
    if (alphabet) {
      beanIndexed = new Map(alphabet.items);
    }
    if (stats) {
      stats.items.forEach((_,code) => {
        if (!beanIndexed.has(code)){
          beanIndexed.set(code, new SymbolBean(code));
        }
      });
    }
    beans = [...beanIndexed.values()];
  }

  async function saveDocument() {
    alphabet?.upload();
  }

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
        await alphabet?.deletePersistent(bean);
      }
      else {
        await alphabet?.addPersistent(bean);
      }
    }
  }

  marked.use(markedTunic({}));
  onMount(() => {
    fetchData();
  });

</script>

{#if alphabet}
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
            <input class="w-100" onchange={onMeaningChanged(bean)} bind:value={bean.meaning} placeholder="?" />
          </TableBodyCell>
          {#if stats}
            <TableBodyCell>{stats.wordsRef(bean.code).length}</TableBodyCell>
            <TableBodyCell>{stats.filesRef(bean.code).length}</TableBodyCell>
          {/if}
        </TableBodyRow>
      {/each}
    </TableBody>  
  </Table>
{/if}


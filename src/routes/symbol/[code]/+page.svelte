<script>
  import { page } from '$app/state';
  import { marked } from 'marked';
  import { markedTunic } from '$lib/marked/marked-tunic.svelte.js';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { SymbolBean } from '$lib/model/SymbolBean.svelte.js';

  let { data } = $props();
  let alphabet = data.alphabet;
  let stats = data.stats;

  /** @type {number} */
  let code = parseInt(page.params.code);
  let knownBean = alphabet?.items.get(code);
  let bean = $state(knownBean ? knownBean : new SymbolBean(code));

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

  let _wordsRef = stats.wordsRef(bean.code);
  let _filesRef = stats.filesRef(bean.code);
  let wordsRef = _wordsRef ? _wordsRef : {};
  let filesRef = _filesRef ? _filesRef : {};

  const Column = {
    word: "word",
    count: "count",
  }
  /** @type {Map<string, function (string, string): number>} */
  const sortfn = new Map([
    [ "word", (a, b) => a.localeCompare(b) ],
    // @ts-ignore
    [ "count", (a, b) => wordsRef[a]?.length - wordsRef[b]?.length ],
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
//        beans.sort((a,b) => sign * cursortfn(a,b));
      }
    }
  }

  marked.use(markedTunic({urls:false}));
</script>

{#if bean}
<div class="grid grid-cols-3">
  <div class="grid grid-cols-1">
    <div class="flex items-center justify-center symbol-big">
      {@html marked(`tunic(${bean.code})`)}
    </div>
    <div class="px-5">
      <Table class="" border={false}>
        <TableBody>
          <TableBodyRow>
            <TableBodyCell class="font-bold w-200">Code</TableBodyCell>
            <TableBodyCell>{bean.codeString}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Meaning</TableBodyCell>
            <TableBodyCell>
              <input class="w-100 text-fuchsia-600 placeholder-fuchsia-200" onchange={onMeaningChanged(bean)} bind:value={bean.meaning} placeholder="Give it to me ..." />
            </TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Number of words using this symbol</TableBodyCell>
            <TableBodyCell>{Object.keys(wordsRef).length}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Number of files using this symbol</TableBodyCell>
            <TableBodyCell>{Object.keys(filesRef).length}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </div>
  </div>
  <div class="col-span-2 grid grid-cols-1 px-5">
    <Table hoverable={true} class="text-center table-90" border={false}>
      <TableHead class="sticky top-0">
        <TableHeadCell class={sortColumn==Column.word ? sortClass : "table-column-sort-none"} onclick={onSort(Column.word)}>Used in these words</TableHeadCell>
        <TableHeadCell class={sortColumn==Column.count ? sortClass : "table-column-sort-none"} onclick={onSort(Column.count)}>Occurences of the words</TableHeadCell>
      </TableHead>
      <TableBody class="overflow-auto">
        {#each Object.keys(wordsRef) as word}
          <TableBodyRow>
            <TableBodyCell>{@html marked(word)}</TableBodyCell>
            <TableBodyCell>{wordsRef[word]?.length}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
</div>
</div>
{/if}

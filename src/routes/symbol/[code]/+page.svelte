<script lang="ts">
  import { Marked } from 'marked';
  import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
  import { markedTunic } from '$lib/marked/marked-tunic.svelte.js';
  import { Alphabet, Statistics, SymbolBean, TokenContext } from '$lib/model/model.svelte.js';
  import { decodeSymbols } from '$lib/model/stores.svelte.js';
  import { SortableHead, SortableHeadCell } from '$lib/graphics/graphics.svelte.js';
  import { goto } from '$app/navigation';

  let { data }: {data: {alphabet: Alphabet, stats:Statistics, code:string}} = $props();
  let alphabet = data.alphabet;
  let stats = data.stats;

  let code = $derived(parseInt(data.code));
  let knownBean = $derived(alphabet?.items.get(code));
  let bean = $derived(knownBean ? knownBean : new SymbolBean(code));
  let _wordsRef = $derived(stats.wordsRef(bean.code));
  let _filesRef = $derived(stats.filesRef(bean.code));
  let wordsRef = $derived(_wordsRef ? _wordsRef : {});
  let filesRef = $derived(_filesRef ? _filesRef : {});
  let items:{word:string, length:number, count:number, refs?:TokenContext[]}[] = $state([]);
  let highlight = $derived({code:code});
  let markedMain: Marked = new Marked(markedTunic({alphabet:undefined, urls: false, decode:{value:false}}));
  let markedList: Marked = $state(new Marked());
  let openRow: number|null = $state(null);

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

  let allwords = $state(0);
  $effect(() => {
    items = Object.entries(wordsRef).map((e) => {
      return {
        word:e[0],
        length:e[1] ? e[1][0].wordChars.length : 0,
        count:e[1] ? e[1].length : 0,
        refs:e[1]
      }
    });
    let cpt = 0;
    Object.keys(wordsRef).forEach((name) => {
      cpt += wordsRef[name] ? wordsRef[name].length : 0;
    })
    allwords = cpt;
  });

  $effect(() => {
    markedList = new Marked(markedTunic({alphabet:alphabet.items, decode:decodeSymbols, highlight:highlight}));
  });

</script>

{#if bean}
<div class="grid grid-cols-3">
  <div class="grid grid-cols-1">
    <div class="flex items-center justify-center symbol-big marked-styles">
      {@html markedMain.parse(`tunic(${bean.code})`)}
    </div>
    <div class="flex justify-center px-5">
      <Table class="max-w-1/4" border={false}>
        <TableBody>
          <TableBodyRow>
            <TableBodyCell class="font-bold w-200">Code</TableBodyCell>
            <TableBodyCell>{bean.codeString}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Meaning</TableBodyCell>
            <TableBodyCell>
              <input class="text-fuchsia-600 placeholder-fuchsia-200" onchange={onMeaningChanged(bean)} bind:value={bean.meaning} placeholder="Give it to me ..." />
            </TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Differents words using this symbol</TableBodyCell>
            <TableBodyCell>{Object.keys(wordsRef).length}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Differents files using this symbol</TableBodyCell>
            <TableBodyCell>{Object.keys(filesRef).length}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Total number of occurences</TableBodyCell>
            <TableBodyCell>{allwords}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </div>
  </div>
  <div class="col-span-2 grid grid-cols-1 px-5">
    <Table hoverable={true} class="text-center table-90" border={false}>
      <SortableHead class="sticky top-0" applySort={(itemCmp) => items.sort(itemCmp)}>
        {#snippet sortableHeadCells(sortContext)}
          <SortableHeadCell {sortContext} sort={(a,b) => a.word.localeCompare(b.word)}>Words</SortableHeadCell>
          <SortableHeadCell {sortContext} sort={(a,b) => a.length - b.length}>Word length</SortableHeadCell>
          <SortableHeadCell {sortContext} sort={(a,b) => a.count - b.count}>Nb occurences</SortableHeadCell>
        {/snippet}
      </SortableHead>
      <TableBody class="overflow-auto">
        {#each items as item, i}
        <TableBodyRow onclick={() => openRow = openRow === i ? null : i}>
          <TableBodyCell class="marked-styles">{@html markedList.parse(item.word)}</TableBodyCell>
          <TableBodyCell>{item.length}</TableBodyCell>
          <TableBodyCell>{item.count}</TableBodyCell>
        </TableBodyRow>
          {#if openRow === i}
          <TableBodyRow>
            <TableBodyCell colspan={3} class="p-0">
              <Table class="text-center">
                <TableBody>
                  {#if item.refs}
                    {#each item.refs as ref}
                    <TableBodyRow class="cursor-pointer" onclick={() => goto(`/document-editor/${ref.fileName}?selectStart=${ref.wordStart}&selectLenth=${ref.word.length}`)}>
                      <TableBodyCell>{ref.fileName}</TableBodyCell>
                      <TableBodyCell>{ref.wordStart}</TableBodyCell>
                    </TableBodyRow>
                    {/each}
                  {/if}
                </TableBody>
              </Table>
            </TableBodyCell>
          </TableBodyRow>
          {/if}
        {/each}
      </TableBody>
    </Table>
  </div>
</div>
{/if}

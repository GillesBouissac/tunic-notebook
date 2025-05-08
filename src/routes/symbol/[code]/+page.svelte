<script>
  import { page } from '$app/state';
  import { SymbolInteractive } from "$lib/graphics/graphics.svelte";
  import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

  let { data } = $props();
  let alphabet = data.alphabet;

  /** @type {string} */
  let code = page.params.code;
  let bean = $state(alphabet?.items.get(parseInt(code)));

</script>

{#if bean}
<div class="grid grid-cols-2">
  <div class="grid grid-cols-1">
    <div class="flex items-center justify-center">
      <SymbolInteractive {bean} svgClass="symbol-big" />
    </div>
    <div class="flex px-50 justify-center">
      <Table class="" border={false}>
        <TableBody>
          <TableBodyRow>
            <TableBodyCell class="font-bold w-200">Code</TableBodyCell>
            <TableBodyCell>{bean.codeString}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Meaning</TableBodyCell>
            <TableBodyCell>{bean.meaning}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">Word count</TableBodyCell>
            <TableBodyCell>{bean.meaning}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-bold">File count</TableBodyCell>
            <TableBodyCell>{bean.meaning}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </div>
  </div>
</div>
{/if}

<style>
  :global {
    .symbol-big {
      --icon-size: 3rem;
      height: 50dvh;
    }
  }
</style>

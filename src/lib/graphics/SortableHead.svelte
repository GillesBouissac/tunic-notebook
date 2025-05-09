<!-- 
 Fork from https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/table/TableHead.svelte
 To implement sortable columns
 -->
<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import { TableHeadCell, tablehead } from "flowbite-svelte";
  import type { TableHeadProps, TableCtxType, HeadItemType, } from "flowbite-svelte";
  import clsx from "clsx";
  import SortableHeadCell from "./SortableHeadCell.svelte";

  export type CurrentSorted = {
    node:HTMLTableCellElement|undefined,
    set:(value:HTMLTableCellElement) => void
  };

  let {
    children,
    headerSlot,
    headCells,
    color,
    striped,
    border,
    class: className,
    headItems,
    defaultRow = true,
    ...restProps
  }: TableHeadProps & { headCells?: Snippet<[currentSorted:CurrentSorted, direction:"asc" | "desc"]> } = $props();

  const tableCtx = getContext<TableCtxType>("tableCtx");
  // for reactivity with svelte context
  let compoColor = $derived(color ? color : tableCtx.color || "default");
  let compoStriped = $derived(striped ? striped : tableCtx.striped || false);
  let compoBorder = $derived(border ? border : tableCtx.border || false);
  let currentSorted: CurrentSorted = $state({node:undefined, set:(node) => currentSorted.node = node});
  let sortDir:"asc" | "desc" = $state("asc");

  const base = $derived(
    tablehead({
      color: compoColor,
      border: compoBorder,
      striped: compoStriped,
      class: clsx(className),
    })
  );

  function getItemText(item: HeadItemType): string {
    if (typeof item === "object" && "text" in item) {
      return item.text;
    }
    return String(item);
  }
</script>

<thead {...restProps} class={base}>
  {#if headItems}
    {#if headerSlot}
      {@render headerSlot()}
    {/if}
    <tr>
      {#each headItems as item}
        <SortableHeadCell>
          {getItemText(item)}
        </SortableHeadCell>
      {/each}
    </tr>
  {:else if headCells}
    {#if defaultRow}
      <tr>
        {@render headCells(currentSorted, sortDir)}
      </tr>
    {:else}
      {@render headCells(currentSorted, sortDir)}
    {/if}
  {/if}
</thead>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[TableHeadProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1373)
## Props
@prop children
@prop headerSlot
@prop color
@prop striped
@prop border
@prop class: className
@prop headItems
@prop defaultRow = true
@prop ...restProps
-->

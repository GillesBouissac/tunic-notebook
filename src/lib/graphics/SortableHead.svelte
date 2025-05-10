<!-- 
 Fork from https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/table/TableHead.svelte
 To implement sortable columns
 -->
<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import { tablehead } from "flowbite-svelte";
  import type { TableHeadProps, TableCtxType, HeadItemType, } from "flowbite-svelte";
  import clsx from "clsx";
  import SortableHeadCell from "./SortableHeadCell.svelte";

  export type TableSortFunc = (a:any, b:any) => number;

  export type TableSortContext = {
    applySort?: (itemCmp:TableSortFunc) => void,
    setSortedColumn: (value:HTMLTableCellElement) => void,
    currentSortedColumn: HTMLTableCellElement|undefined
  };

  let {
    children,
    headerSlot,
    sortableHeadCells,
    applySort,
    color,
    striped,
    border,
    class: className,
    headItems,
    defaultRow = true,
    ...restProps
  }: TableHeadProps & {
    applySort?: (itemCmp:TableSortFunc) => void,
    sortableHeadCells?: Snippet<[TableSortContext]>
  } = $props();

  const tableCtx = getContext<TableCtxType>("tableCtx");
  // for reactivity with svelte context
  let compoColor = $derived(color ? color : tableCtx.color || "default");
  let compoStriped = $derived(striped ? striped : tableCtx.striped || false);
  let compoBorder = $derived(border ? border : tableCtx.border || false);
  let sortContext:TableSortContext = $state({
    applySort:applySort,
    setSortedColumn:(column) => sortContext.currentSortedColumn = column,
    currentSortedColumn:undefined
  });

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
  {:else if sortableHeadCells}
    {#if defaultRow}
      <tr>
        {@render sortableHeadCells(sortContext)}
      </tr>
    {:else}
      {@render sortableHeadCells(sortContext)}
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

<!-- 
 Fork from https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/table/TableHead.svelte
 To fix sortable columns
 -->
<script lang="ts">
    import clsx from "clsx";
    import { tableheadcell } from "flowbite-svelte";
    import type { TableHeadCellProps } from "flowbite-svelte";
    import type { TableSortContext } from "./SortableHead.svelte";

    let {
        sortContext,
        children,
        class: className,
        sort: sortFn,
        ...restProps
    }: TableHeadCellProps & {
        sortContext?: TableSortContext,
    } = $props();
    const base = $derived(tableheadcell({ class: clsx(className) }));

    let direction: "asc" | "desc" = $state("asc");
    let sortClass = $state(" table-column-sort-none");
    let thisHeader: HTMLTableCellElement|undefined = $state(undefined);
    function onclick(_:MouseEvent & { currentTarget: EventTarget & HTMLTableCellElement; }) {
        if (sortContext && thisHeader) sortContext.setSortedColumn(thisHeader);
        direction = direction=="asc" ? "desc" : "asc";
        let sign = direction=="asc" ? +1 : -1;
        if (sortContext?.applySort && sortFn) {
            sortContext.applySort((a,b) => sign * sortFn(a,b));
        }
    }

    $effect(() => {
        if (thisHeader && sortContext?.currentSortedColumn?.isSameNode(thisHeader)) {
            sortClass = direction=="asc" ? " table-column-sort-asc" : " table-column-sort-dsc";
        }
        else {
            sortClass = " table-column-sort-none";
        }
    });

</script>

<th {...restProps} bind:this={thisHeader} class={base+sortClass} {onclick}>
  {#if children}
    {@render children()}
  {/if}
</th>

<!--
  @component
  [Go to docs](https://flowbite-svelte.com/)
  ## Type
  [TableHeadCellProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1422)
  ## Props
  @prop children
  @prop class: className
  @prop ...restProps
  -->

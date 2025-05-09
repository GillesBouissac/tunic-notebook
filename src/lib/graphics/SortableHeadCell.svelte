<!-- 
 Fork from https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/table/TableHead.svelte
 To fix sortable columns
 -->
<script lang="ts">
    import clsx from "clsx";
    import { tableheadcell } from "flowbite-svelte";
    import type { TableHeadCellProps } from "flowbite-svelte";
  import type { CurrentSorted } from "./SortableHead.svelte";

    let {
        applySort,
        children,
        class: className,
        currentSorted,
        sort: sortFn,
        direction,
        ...restProps
    }: TableHeadCellProps & {
        applySort?: (sortFn:(a:any, b:any) => void) => void,
        sort?: (a:any, b:any) => void,
        currentSorted?:CurrentSorted, direction?:"asc" | "desc"
    } = $props();
    const base = $derived(tableheadcell({ class: clsx(className) }));

    let sortClass = $state(" table-column-sort-none");
    let thisHeader: HTMLTableCellElement|undefined = $state(undefined);
    function onclick(_:MouseEvent & { currentTarget: EventTarget & HTMLTableCellElement; }) {
        if (currentSorted && thisHeader) currentSorted.set(thisHeader);
        direction = direction=="asc" ? "desc" : "asc";
        let sign = direction=="asc" ? +1 : -1;
        if (applySort && sortFn) {
            applySort((a,b) => sign * sortFn(a,b));
        }
    }

    $effect(() => {
        if (thisHeader && currentSorted?.node?.isSameNode(thisHeader)) {
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

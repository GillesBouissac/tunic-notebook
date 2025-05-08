<script>
    import { Tooltip } from "flowbite-svelte";
    /** @typedef {import("@floating-ui/utils").Placement} Placement */

    /** @type {{ arrow?: boolean, placement?: Placement, class?: string, children?: any }} */
    let { arrow, placement, class: tooltipClass, children } = $props();
</script>

<Tooltip {placement} {arrow} type="dark" class="{tooltipClass} text-center">
    {#if children}
        {@render children()}
    {/if}
</Tooltip>


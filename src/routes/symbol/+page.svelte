<script>
  import { SymbolBean } from "$lib/model/model.svelte.js";
  import { SymbolInteractive } from "$lib/graphics/graphics.svelte";

  /**
   * @param {number} min
   * @param {number} max
   */
  function generateInRange( min, max ) {
    let range = max-min;
    return min + Math.floor(Math.random() * range);
  }

  let bean = $state(new SymbolBean(generateInRange(0, 0x8000), "Symbol meaning ?"));
</script>

<div class="flex items-center justify-center">
  <SymbolInteractive {bean} svgClass="symbol-big" />
</div>

<style>
  :global {
    .symbol-big {
      --icon-size: 3rem;
      width: 400px;
    }
  }
</style>

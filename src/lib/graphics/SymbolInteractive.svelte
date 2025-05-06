<script>
  import { Shape, SYMBOL_PARTS } from "$lib/graphics/Symbol.svelte";
  import { SymbolBean } from "$lib/model/SymbolBean.svelte";
  /** @typedef {import("$lib/graphics/Symbol.svelte").Shape} Shape */


  /**
   * @type {{
   *    svgClass?: string,
   *    segmentWidth?: number,
   *    bean: SymbolBean
   * }} */
  let { svgClass = "", segmentWidth = 2, bean } = $props();

  let styleSymbolOn = "100%";
  let styleSymbolOff = "8%";
  let viewBox = `${-segmentWidth/2} -4 ${20+segmentWidth/2} 44`;

  /**
   * @param {MouseEvent & { currentTarget: EventTarget & SVGPathElement; }} e
   * @param {number} value
   */
  function onClick(e, value) {
    if (e.target && e.target instanceof SVGGeometryElement) {
      if (isBitSet(bean.code, value)) {
        bean.code = bean.code & ~value;
      } else {
        bean.code = bean.code | value;
      }
    }
  }

  /**
   * @param {number} value
   * @param {number} bit
   */
  function isBitSet(value, bit) {
    return (bit==0) || (value & bit) != 0;
  }

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex justify-center w-full">
  <svg {viewBox} class="{svgClass}">
    <g>
      {#each SYMBOL_PARTS as part}
        {#if part.shape==Shape.segment}
          <path
            d="M {part.x1},{part.y1} {part.x2},{part.y2}"
            onclick={(e) => onClick(e, part.code)}
            style="opacity:{isBitSet(bean.code, part.code)
              ? styleSymbolOn
              : styleSymbolOff};stroke-width:{segmentWidth}"
            class="symbol-segment"
          />
        {/if}
        {#if part.shape==Shape.circle}
          <circle
            cx={part.x1}
            cy={part.y1}
            r={part.r}
            onclick={(e) => onClick(e, part.code)}
            style="opacity:{isBitSet(bean.code, part.code)
              ? styleSymbolOn
              : styleSymbolOff};stroke-width:{segmentWidth}"
            class="symbol-segment"
          />
        {/if}
      {/each}
      <text text-anchor="middle" class="symbol-text" x="10" y="18">{bean.codeString}</text>
    </g>
  </svg>
</div>

<style>
  .symbol-segment {
    stroke: #000;
    stroke-linecap: round;
    stroke-dasharray: none;
    fill:none;
  }
  .symbol-text {
    font-family: Arial;
    font-size: 1.5px;
  }
</style>

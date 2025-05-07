<script>
  import { Shape, SYMBOL_PARTS } from "$lib/graphics/Symbol.svelte";
  import { SymbolBean } from "$lib/model/SymbolBean.svelte";
  import { onMount } from "svelte";
  /** @typedef {import("$lib/graphics/Symbol.svelte").SymbolPart} SymbolPart */

  /**
   * @type {{
   *    bean: SymbolBean,
   *    svgClass?: string,
   *    segmentWidth?: number
   * }} */
  let { bean, svgClass = "", segmentWidth = 2 } = $props();

  let styleSymbolOn = "100%";
  let styleSymbolOff = "8%";
  let viewBox = `${-segmentWidth/2} -4 ${20+segmentWidth/2} 44`;
  let mouseDown = false;

  /**
   * @param {MouseEvent & { currentTarget: EventTarget & SVGPathElement; }} e
   * @param {number} code
   */
  function onClick(e, code) {
    if (e.target && e.target instanceof SVGGeometryElement) {
      if (isBitSet(bean.code, code)) {
        bean.code = bean.code & ~code;
      } else {
        bean.code = bean.code | code;
      }
    }
  }

  /**
   * @param {MouseEvent & { currentTarget: EventTarget & SVGPathElement; }} e
   * @param {number} code
   */
  function onMouseEnter(e, code) {
    if (mouseDown && e.target && e.target instanceof SVGGeometryElement) {
      if (isBitSet(bean.code, code)) {
        bean.code = bean.code & ~code;
      } else {
        bean.code = bean.code | code;
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

  /** @param {SymbolPart} part */
  function computeStrokeStyle(part) {
    return `opacity:${isBitSet(bean.code, part.code)?styleSymbolOn:styleSymbolOff};stroke-width:${segmentWidth}`;
  }

  onMount(() => {
    document.body.onmousedown = function() { 
      mouseDown = true;
    }
    document.body.onmouseup = function() {
      mouseDown = false;
    }
  });

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div>
  <svg {viewBox} class="{svgClass}">
    <g>
      {#each SYMBOL_PARTS as part}
        {#if part.shape==Shape.segment}
          <path d="M {part.x1},{part.y1} {part.x2},{part.y2}"
            onclick={(e) => onClick(e, part.code)}
            onmouseenter={(e) => onMouseEnter(e, part.code)}
            style={computeStrokeStyle(part)}
            class="symbol-segment"
          />
        {/if}
        {#if part.shape==Shape.circle}
          <circle cx={part.x1} cy={part.y1} r={part.r}
            onclick={(e) => onClick(e, part.code)}
            onmouseenter={(e) => onMouseEnter(e, part.code)}
            style={computeStrokeStyle(part)}
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
    font-size: 2px;
  }
</style>

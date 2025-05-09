<script>
  import { Shape, SYMBOL_PARTS } from "$lib/graphics/Symbol.svelte";
  import { SymbolBean } from "$lib/model/SymbolBean.svelte";
  /** @typedef {import("$lib/graphics/Symbol.svelte").SymbolPart} SymbolPart */

  /** @type {{bean: SymbolBean, svgClass?: string, segmentWidth?: number }} */
  let { bean, svgClass = "", segmentWidth = 2 } = $props();

  let styleSymbolOn = "#000";
  let styleSymbolOff = "#eee";
  let viewBox = `${-segmentWidth/2} -4 ${20+segmentWidth/2} 44`;
  let mouseDown = false;

  /** @type {SymbolPart[]}*/
  let symbolElementOn = $state([]);

  /** @type {SymbolPart[]}*/
  let symbolElementOff = $state([]);

  /** @type {number} */
  let lastRenderdCode;

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
    return `stroke:${isBitSet(bean.code, part.code)?styleSymbolOn:styleSymbolOff};stroke-width:${segmentWidth}`;
  }

  document.body.onmousedown = function() { 
    mouseDown = true;
  }
  document.body.onmouseup = function() {
    mouseDown = false;
  }

  /** @param {SymbolBean} b */
  function updateSymbol(b) {
    if (lastRenderdCode != b.code) {
      symbolElementOn = [];
      symbolElementOff = [];
      for ( const part of SYMBOL_PARTS) {
        if (isBitSet(b.code, part.code)) {
          symbolElementOn.push(part);
        }
        else {
          symbolElementOff.push(part);
        }
      }
      lastRenderdCode = b.code;

    }
  }

  $effect(() => {
    updateSymbol(bean);
  });

  updateSymbol(bean);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#snippet renderElement(/** @type {SymbolPart} */ part)}
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
{/snippet}

<div>
  <svg {viewBox} class="{svgClass}">
    <g>
      {#each symbolElementOff as part}
        {@render renderElement(part)}
      {/each}
      {#each symbolElementOn as part}
        {@render renderElement(part)}
      {/each}
      <text text-anchor="middle" class="symbol-text" x="10" y="18">tunic({bean.codeString})</text>
    </g>
  </svg>
</div>

<style>
  .symbol-segment {
    stroke-linecap: round;
    stroke-dasharray: none;
    fill:none;
  }
  .symbol-text {
    font-family: Arial;
    font-size: 2px;
  }
</style>

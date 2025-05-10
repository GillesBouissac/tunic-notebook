<script lang="ts">
  import { Shape, SYMBOL_PARTS } from "$lib/graphics/Symbol.svelte";
  import { SymbolBean } from "$lib/model/SymbolBean.svelte";
  import type { SymbolPart } from "$lib/graphics/Symbol.svelte";

  /** @type {{bean: SymbolBean, svgClass?: string, segmentWidth?: number }} */
  let { bean, svgClass = "", segmentWidth = 2 } = $props();

  let styleSymbolOn = "#000";
  let styleSymbolOff = "#eee";
  let viewBox = `${-segmentWidth/2} -2 ${20+segmentWidth/2} 38`;
  let mouseDown = false;
  let segmentCodeUnderMouse:number = 0;

  let symbolElementOn: SymbolPart[] = $state([]);
  let symbolElementOff: SymbolPart[] = $state([]);
  let lastRenderdCode: number;

  function onClick(e: MouseEvent & { currentTarget: EventTarget & SVGPathElement; }, code: number) {
    if (e.target && e.target instanceof SVGGeometryElement) {
      if (isBitSet(bean.code, code)) {
        bean.code = bean.code & ~code;
      } else {
        bean.code = bean.code | code;
      }
    }
  }
 
  function onMouseEnter(e: MouseEvent & { currentTarget: EventTarget & SVGPathElement; }, code: number) {
    if (mouseDown && e.target && e.target instanceof SVGGeometryElement && segmentCodeUnderMouse!=code) {
      segmentCodeUnderMouse = code;
      if (isBitSet(bean.code, code)) {
        bean.code = bean.code & ~code;
      } else {
        bean.code = bean.code | code;
      }
    }
  }

  function isBitSet(value: number, bit: number) {
    return (bit==0) || (value & bit) != 0;
  }

  function computeStrokeStyle(part:SymbolPart ) {
    return `stroke:${isBitSet(bean.code, part.code)?styleSymbolOn:styleSymbolOff};stroke-width:${segmentWidth}`;
  }

  function updateSymbol(b: SymbolBean) {
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

  document.body.onmousedown = function(e) { 
    mouseDown = true;
  }
  document.body.onmouseup = function(e) {
    mouseDown = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#snippet renderElement( part: SymbolPart)}
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
  <p class="text-center">tunic({bean.codeString})</p>
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

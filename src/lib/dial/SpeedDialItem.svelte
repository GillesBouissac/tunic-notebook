<script>
  import { SymbolDocumentItem } from "../model/model.svelte.js";
  import Fa from "svelte-fa";

  /** @type {SpeedDialOptionalParams} */
  export let button;
  /** @type {EventTarget|null} */
  export let target;
  /** @type {SymbolDocumentItem|null} */
  export let item;

</script>

<div>
  {#if button}
  <button
    class="speed-dial-btn {button.bg} hover:{button.hover}"
    on:click={() => button.onclick(item, target)}>
    <Fa icon={button.icon} />
  </button>
  {/if}
</div>

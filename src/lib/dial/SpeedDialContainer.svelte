<script>
  import {SymbolDocumentItem} from "../model/model.svelte.js";
  import {SpeedDial} from "./dial.svelte.js";

  /**
   * @type {{ dial: SpeedDial, children: any, data: SymbolDocumentItem }}
   */
   let { dial, children, data = $bindable() } = $props();

  /** @type {HTMLDivElement} */
  let thisComponent;

  function mouseMove() {
    dial.showAt(thisComponent, data);
  }

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div bind:this={thisComponent} class="speed-dial-parent align-middle" onmouseover={mouseMove}>
  {@render children()}
</div>

<style>
  .speed-dial-parent {
    position: relative;
    display: inherit;
  }
</style>

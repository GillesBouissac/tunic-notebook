<script>
  import {SymbolDocumentItem} from "../model/model.svelte.js";

  /** @type {number} */
  let x = $state(0);
  /** @type {number} */
	let y = $state(0);
  /** @type {string} */
  let visible = $state("hidden");
  /** @type {NodeJS.Timeout} */
  let hideTimer;
  /** @type {EventTarget | null} */
  let attachedTo = $state(new EventTarget());
  /** @type {SymbolDocumentItem|null} */
  let attachedBean = $state(null);

  /**
   * @type {{ buttons: SpeedDialParamList, item: function(SpeedDialOptionalParams, EventTarget|null, SymbolDocumentItem|null):any }}
   */
  let { buttons, item } = $props();

  /**
   * @param {EventTarget | null} element
   * @param {SymbolDocumentItem} bean
   */
  export function showAt (element, bean) {
    visible = "visible";
    attachedTo = element;
    attachedBean = bean;

    // @ts-ignore
    let rect = element.getBoundingClientRect();
    if (rect) {
      x = (rect.left + rect.right)/2;
      y = (rect.bottom + rect.top)/2;
    }

    clearInterval(hideTimer);
    hideTimer = setInterval (() => {
      visible = "hidden";
    }, 1000);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if buttons && buttons.length}
  <div class="speed-dial grid grid-cols-3" style="left:{x}px; top:{y}px; visibility:{visible}">
    {#each buttons as button}
      {@render item(button, attachedTo, attachedBean)}
    {/each}
  </div>
{/if}

<style>
  .speed-dial {
    position: absolute;
    top: 0px;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>

<script>
  import { Modal, Textarea, A, Label } from 'flowbite-svelte';
  import { onMount } from "svelte";

  /* @type {{ bean: {text: string}, textClass:string, onchanged: function(): void }} */
  let { bean, textClass="", onchanged = () => {} } = $props();

  /**
   * @type {boolean}
   */
  let showEditor = $state(false);

  let ready = false;

  function fireChanged() {
    if (ready) {
      onchanged();
    }
  }

  onMount(() => {
    ready = true;
  });

</script>

{#if bean}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore event_directive_deprecated -->
  <div class="cursor-pointer {textClass}" on:click={() => {showEditor=true}}>
    <A class="text-blue-700">{bean.text}</A>
  </div>
  <Modal bind:open={showEditor} autoclose outsideclose on:close={fireChanged}>
    <Label class="space-y-2">
      <Textarea autofocus bind:value={bean.text} required />
    </Label>
  </Modal>
{/if}

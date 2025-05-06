<script>
  import { Modal } from 'flowbite-svelte';
  import { onMount } from "svelte";
  import { SymbolBean, Alphabet } from "$lib/model/model.svelte.js";
  import SymbolInteractive from "$lib/graphics/SymbolInteractive.svelte";

  /** @type {{ bean: SymbolBean, oncodechanged?: function(): void }} */
  let { bean, oncodechanged = () => {} } = $props();

  /** @type {Alphabet|undefined} */
  let alphabet = $state(undefined);

  /** @type {boolean} */
  let showEditor = $state(false);

  /** @type {SymbolBean} */
  let beanBefore = SymbolBean.clone(bean);

  /** @type {SymbolBean} */
  let alphabetBeanBefore;

  /** @type {SymbolBean|undefined} */
  let alphabetBean = $derived.by( () => {
    if (alphabet && bean) {
      let found = alphabet.get(bean.code);
      if (bean.code != alphabetBeanBefore?.code) {
        alphabetBeanBefore = SymbolBean.clone(found);
      }
      return found;
    }
  });

  async function fetchData() {
    alphabet = await Alphabet.fetch("alphabet");;
  }

  async function onclose() {
    if (beanBefore.code != bean.code) {
      if (oncodechanged) {
        oncodechanged();
      }
    }
    if (alphabetBeanBefore?.meaning != alphabetBean?.meaning) {
      alphabet?.save();
    }
  }

  onMount(() => {
    fetchData();
  });

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="cursor-pointer inline" onclick={() => {showEditor=true}}>
  <SymbolInteractive bean={bean}/>
</div>

<Modal bind:open={showEditor} autoclose outsideclose on:close={onclose}>
  <div class="editor-container flex h-full w-full space-y-2">
    <div class="grid grid-cols-2">
      <div class="flex flex-col">
        <span class="text-center">Current symbol</span>
        <div class="flex editable-symbol m-4 justify-center">
          <SymbolInteractive icon={false} editShape={true} bean={bean}></SymbolInteractive>
        </div>
      </div>
      {#if alphabetBean}
        <div class="flex flex-col">
          <span class="text-center">Alphabet</span>
          <div class="flex editable-symbol m-4 justify-center">
            <SymbolInteractive icon={false} editMeaning={true} bean={alphabetBean}></SymbolInteractive>
          </div>
        </div>
      {/if}
    </div>
  </div>
</Modal>

<style>
  .editable-symbol {
    --icon-size: 3rem;
    width: 300px;
  }
</style>

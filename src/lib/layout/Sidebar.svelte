<script>
  import {
    Drawer,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";

  /** @type {{open: boolean}} */
  let { open = $bindable(false) } = $props();

  let hidden = false
  let closedClass = $derived (open ? "" : "drawer-closed" );
  let activateClickOutside = false;

  let transitionParams = {
    x: -320,
    duration: 300,
    easing: sineIn,
  };

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="fixed w-42 h-full top-0 {closedClass}"
  onmouseenter={() => {open=true;}}
  onmouseleave={() => {open=false;}}
>
  <Drawer
    {activateClickOutside}
    {transitionParams}
    hidden={hidden}
    backdrop={false}
    position="absolute"
    transitionType="fly"
    id="sidebar"
    placement="left"
    leftOffset="inset-y-0 start-0"
    width="w-42"
    class="overflow-scroll pb-32 drawer-style"
  >
    <div class="flex items-center">
      <h5
        id="drawer-navigation-label-3"
        class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
      >
        Menu
      </h5>
    </div>
    <Sidebar asideClass="w-40">
      <SidebarWrapper
        divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800"
      >
        <SidebarGroup>
          <SidebarItem label="Symbol" href="/symbol" />
          <SidebarItem label="Alphabet" href="/alphabet" />
          <SidebarItem label="Gallery" href="/gallery" />
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </Drawer>
</div>

<style>
  :global(.drawer-closed) {
    inset-inline-start: calc(var(--spacing) * -38);
    background-color: #eee;
  }
  :global(.drawer-style) {
    background-color: #eee;
  }
</style>

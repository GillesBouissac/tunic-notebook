<script>
  import { page } from '$app/state';
  const imageName = page.url.searchParams.get('name');

  function back() {
    window.history.back();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="h-full w-full content-center" onclick={back}>
  <img alt="{imageName}" src="/api/screenshots/{imageName}" class="mx-auto"/>
</div>

<style>
  img {
    max-width: 100%;
    max-height: 100%;
  }
</style>

<script>
  import { page } from '$app/state';
  const imageName = page.url.searchParams.get('name');

  /** @param {MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }} e */
  function back(e) {
    window.history.back();
    e.preventDefault();
  }
</script>

<div class="h-full w-full content-center">
  <a href="/" onclick={back}>
    <img alt="{imageName}" src="/api/screenshots/{imageName}" class="mx-auto"/>
  </a>
</div>

<style>
  img {
    max-width: 100%;
    max-height: 100%;
  }
</style>

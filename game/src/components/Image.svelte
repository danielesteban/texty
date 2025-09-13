<script lang="ts">
  let { data }: {
    data: Uint8Array;
  } = $props();

  let url = $state<string>(null!);
  $effect(() => {
    // @ts-ignore
    url = URL.createObjectURL(new Blob([data]));
    return () => {
      URL.revokeObjectURL(url);
    }
  });
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<img src={url} />

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

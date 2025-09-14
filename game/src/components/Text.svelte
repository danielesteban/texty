<script lang="ts">
  let { value }: {
    value: string;
  } = $props();

  let lines = $derived(value.split('\n'));
</script>

{#each lines as line}
  <div>{line}</div>
{/each}

<script lang="ts">
  import { type Snippet } from 'svelte';
  let { children, position }: {
    children: Snippet;
    position: { x: number, y: number } | null;
  }= $props();
</script>

{#if position}
  <div
    class="menu"
    onpointerdown={(e) => e.stopPropagation()}
    style="top: {position.y}px; left: {position.x}px"
  >
    {@render children()}
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    width: 100px;
    background: #111;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
  }
</style>

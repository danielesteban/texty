<script lang="ts">
  import { User } from 'state/User.svelte';
  import Auth from 'views/Auth.svelte';
  import Editor from 'views/Editor.svelte';
</script>

{#if !User.session}
  <Auth />
{:else}
  <Editor />
{/if}

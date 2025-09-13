<script lang="ts">
  import { User } from 'state/User.svelte';
  import Auth from 'views/Auth.svelte';
  import Editor from 'views/Editor.svelte';
  import Menu from 'views/Menu.svelte';
  import { Editor as EditorState } from 'state/Editor.svelte';

  const router = () => {
    const [route] = location.hash.slice(2).split('/');
    if (route === '') {
      EditorState.unload();
      return; 
    }
    if (route.length === 24) {
      EditorState.load(route);
      return;
    }
    location.hash = '/';
  };

  window.addEventListener('hashchange', router);
  router();
</script>

{#if !User.session}
  <Auth />
{:else if EditorState.hasLoaded}
  <Editor />
{:else}
  <Menu />
{/if}

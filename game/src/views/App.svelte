<script lang="ts">
  import iPhone from 'assets/iphone.png';
  import { Game as GameState } from 'state/Game.svelte';
  import Game from 'views/Game.svelte';
  import Loading from 'views/Loading.svelte';
  import Menu from 'views/Menu.svelte';

  const router = () => {
    const [route] = location.hash.slice(2).split('/');
    if (route === '') {
      GameState.unload();
      return; 
    }
    if (route.length === 24) {
      GameState.load(route)
        .catch(() => { location.hash = '/'; });
      return;
    }
    location.hash = '/';
  };

  window.addEventListener('hashchange', router);
  router();
</script>

<div class="app">
  <div class="phone" style="--background-image: url({iPhone})">
    {#if GameState.isLoading}
      <Loading />
    {:else if GameState.hasLoaded}
      <Game />
    {:else}
      <Menu />
    {/if}
  </div>
</div>

<style>
  .app {
    height: 100%;
    display: grid;
    place-items: center;
  }

  .phone {
    width: 100%;
    height: 100%;
    display: grid;
    min-height: 0;
  }

  @media (min-width: 700px) {
    .phone {
      width: 370px;
      height: 640px;
      background-image: var(--background-image);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      padding: 8rem 4rem 8rem 5.5rem;
    }
  }
</style>

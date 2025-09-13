<script lang="ts">
  import Game from 'views/Game.svelte';
  import iPhone from '../iphone.png';
</script>

<div class="app">
  <div class="phone" style="--background-image: url({iPhone})">
    <Game />
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
  }

  @media (min-width: 700px) {
    .phone {
      width: 360px;
      height: 640px;
      background-image: var(--background-image);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      padding: 8rem 4rem 8rem 5rem;
    }
  }
</style>

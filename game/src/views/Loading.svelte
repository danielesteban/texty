<script lang="ts">
  import { Spinner } from 'spin.js';
  import 'spin.js/spin.css';

  let target = $state<HTMLDivElement>(null!);

  $effect(() => {
    const spinner = new Spinner({ color: '#eee' }).spin(target);
    return () => {
      spinner.stop();
    };
  })
</script>

<div class="wrapper">
  <div bind:this={target}></div>
</div>

<style>
  .wrapper {
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>

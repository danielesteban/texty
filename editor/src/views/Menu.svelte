<script lang="ts">
  import { Editor } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  let scenarios = $state<{ _id: string; name: string; description: string; }[]>([]);

  Editor.list().then((list) => {
    scenarios = list;
  });
</script>

<div class="wrapper">
  <div class="menu">
    <div class="header">
      {Lang.current.selectScenario}
    </div>
    <div class="scenarios">
      {#each scenarios as scenario}
        <a class="scenario" href={`/#/${scenario._id}`}>
          <button>
            <!-- svelte-ignore a11y_missing_attribute -->
            <img class="photo" src={`${__SERVER__}scenario/${scenario._id}/photo`} crossorigin="anonymous" />
            <div class="info">
              <div>{scenario.name}</div>
              <div class="description">{scenario.description}</div>
            </div>
          </button>
        </a>
      {/each}
    </div>
    <button
      class="create"
      onclick={() => Editor.create()}
    >
      {Lang.current.createScenario}
    </button>
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
    display: grid;
    place-items: center;
  }

  .menu {
    background: #111;
    border: 1px solid #000;
    border-radius: 0.5rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 1rem;
    gap: 1rem;
    overflow: hidden;
  }

  .header {
    display: grid;
    justify-content: center;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .scenarios {
    display: grid;
    gap: 0.5rem;
    max-height: 600px;
    min-width: 300px;
    overflow-y: auto;
  }

  .scenario {
    display: grid;
    text-decoration: none;
  }

  .scenario > button {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }

  .photo {
    width: 4rem;
    height: 4rem;
    border: 4px solid #333;
    border-radius: 8rem;
    pointer-events: none;
    overflow: hidden;
  }

  .info {
    display: grid;
    gap: 0.5rem;
  }

  .description {
    color: #999;
  }
</style>

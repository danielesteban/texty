<script lang="ts">
  import { Lang } from 'state/Lang.svelte';

  let scenarios = $state<{ _id: string; name: string; description: string; }[]>([]);

  fetch(`${__SERVER__}scenarios`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((list) => {
      scenarios = list;
    });
</script>

<div class="menu">
  <div class="header">
    {Lang.current.selectScenario}
  </div>
  <div class="scenarios">
    {#each scenarios as scenario (scenario._id)}
      <a class="scenario" href={`#/${scenario._id}`}>
        <button>
          <!-- svelte-ignore a11y_missing_attribute -->
          <img class="photo" src={`${__SERVER__}scenario/${scenario._id}/photo`} crossorigin="anonymous" />
          <div>
            <div>{scenario.name}</div>
            <div class="description">{scenario.description}</div>
          </div>
        </button>
      </a>
    {/each}
  </div>
</div>

<style>
  .menu {
    background: #111;
    border-radius: 0.5rem;
    display: grid;
    align-content: flex-start;
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
    overflow-y: auto;
  }

  .scenario {
    display: grid;
    text-decoration: none;
  }

  .scenario > button {
    display: grid;
    justify-items: center;
    gap: 0.5rem;
  }

  .photo {
    width: 4rem;
    height: 4rem;
    border: 4px solid #333;
    border-radius: 8rem;
    pointer-events: none;
    overflow: hidden;
  }

  .description {
    color: #999;
  }
</style>

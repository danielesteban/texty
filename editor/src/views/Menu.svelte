<script lang="ts">
  import { Editor } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';
  import { User } from 'state/User.svelte';

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
      {:else}
        <div class="empty">
          {Lang.current.emptyScenarios}
        </div>
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

<div class="user">
  <button>
    <div>
      {User.name}
    </div>
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 10L12 14L8 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <div class="dropdown">
    <button onclick={User.logout}>
      {Lang.current.signout}
    </button>
  </div>
</div>

<div class="info">
  <a href="https://dani.gatunes.com" rel="noopener noreferrer" target="_blank">dani@gatunes</a> © 2025
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

  .empty {
    display: grid;
    justify-content: center;
    color: #999;
    padding: 1rem 0;
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

  .description {
    color: #999;
  }

  .user {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .user > button {
    display: grid;
    grid-template-columns: 1fr auto;
    min-width: 134px;
    gap: 1rem;
    cursor: default;
  }

  .user > button > div {
    display: grid;
    justify-content: flex-start;
  }

  .user .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 100px;
    background: #111;
    border: 1px solid #000;
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 1rem;
    display: none;
    align-content: flex-start;
    gap: 0.5rem;
  }

  .user:hover > button {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .user:hover .dropdown {
    display: grid;
  }

  .info {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    color: #999;
  }
</style>

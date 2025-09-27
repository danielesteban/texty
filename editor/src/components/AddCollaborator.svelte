<script lang="ts">
  import { Editor } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';
  import { User } from 'state/User.svelte';

  let username = $state('');

  $effect(() => {
    if (Editor.addingCollaborator) {
      username = '';
    }
  });

  const addCollaborator = async (e: SubmitEvent) => {
    e.preventDefault();
    const users = await User.search(username);
    const user = users[0];
    if (user) {
      try {
        Editor.update({
          addScenarioCollaborator: {
            id: Editor.addingCollaborator,
            value: user,
          },
        });
      } catch (e) {}
    }
    Editor.addingCollaborator = null;
  };
  
  const hide = (e: PointerEvent) => {
    if (e.currentTarget === e.target) {
      Editor.addingCollaborator = null;
    }
  };
</script>

{#if Editor.addingCollaborator}
  <div class="overlay" onpointerdown={hide}>
    <div class="modal">
      <form onsubmit={addCollaborator}>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label>{Lang.current.username}</label>
        <div>
          <input
            spellcheck={false}
            type="text"
            bind:value={username}
          />
        </div>
        <div class="submit">
          <button type="submit" disabled={username.length < 3 || username.length > 15}>
            {Lang.current.addCollaborator}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(0.25rem);
    display: grid;
    place-items: center;
    overflow-y: auto;
  }

  .modal {
    box-sizing: border-box;
    width: 300px;
    background: #111;
    border: 1px solid #000;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .modal > form {
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
  }

  .submit {
    display: grid;
    justify-content: center;
  }
</style>

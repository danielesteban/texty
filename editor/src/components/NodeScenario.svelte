<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import Image from 'components/Image.svelte';
  import { ResizeImage } from 'helpers/ResizeImage';
  import { Editor, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';
  import { User } from 'state/User.svelte';

  let { data, wiringStart }: {
    data: Node;
    wiringStart: (node: Node) => (e: PointerEvent) => void;
  } = $props();

  const updateName = (value: string) => {
    Editor.update({
      setScenarioName: {
        id: data.id!,
        value,
      },
    });
  };

  const updateDescription = (value: string) => {
    Editor.update({
      setScenarioDescription: {
        id: data.id!,
        value,
      },
    });
  };

  const updatePhoto = async (e: DragEvent) => {
    if (!e.dataTransfer) {
      return;
    }
    const [file] = e.dataTransfer.files;
    if (!file || file.type.substring(0, 6) !== 'image/') {
      return;
    }
    Editor.update({
      setScenarioPhoto: {
        id: data.id!,
        value: await ResizeImage(file, { x: 128, y: 128 }),
      },
    });
  };

  const addCollaborator = async () => {
    const name = prompt('username');
    if (!name || name.length < 3 || name.length > 15) {
      return;
    }
    const users = await User.search(name);
    const user = users[0];
    if (!user || user === User.name) {
      return;
    }
    Editor.update({
      addScenarioCollaborator: {
        id: data.id!,
        value: user,
      },
    });
  };

  const removeCollaborator = (username: string) => () => {
    Editor.update({
      removeScenarioCollaborator: {
        id: data.id!,
        value: username,
      },
    });
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="photo" ondrop={updatePhoto}>
  <div class="image">
    <Image data={data.scenario!.photo!} />
  </div>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.name}</label>
<div class="connection">
  <input
    type="text"
    spellcheck={false}
    value={data.scenario!.name!}
    oninput={({ currentTarget: { value } }) => updateName(value)}
  />
  <Connector
    position="right"
    onpointerdown={wiringStart(data)}
  />
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.description}</label>
<div class="description">
  <textarea
    value={data.scenario!.description}
    oninput={({ currentTarget: { value } }) => updateDescription(value)}
  ></textarea>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.creator}</label>
<div>
  {data.scenario!.creator}
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="collaborators">
  {Lang.current.collaborators}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button onclick={addCollaborator}>
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</label>
{#each data.scenario!.collaborators! as collaborator}
  <div class="collaborator">
    <div>
      {collaborator}
    </div>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      disabled={collaborator === User.name}
      onclick={removeCollaborator(collaborator)}
    >
      <svg width="1rem" height="1rem" viewBox="-6.5 -3 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
      </svg>
    </button>
  </div>
{:else}
  <div class="empty">
    {Lang.current.emptyCollaborators}
  </div>
{/each}

<style>
  .connection {
    position: relative;
  }

  .description > textarea {
    height: 4.5rem;
  }

  .photo {
    display: grid;
    justify-content: center;
  }

  .image {
    width: 8rem;
    height: 8rem;
    border: 4px solid #222;
    border-radius: 8rem;
    pointer-events: none;
    overflow: hidden;
  }
  
  .empty {
    display: grid;
    justify-content: center;
    color: #666;
    padding: 0.5rem 0;
  }

  .collaborators {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .collaborators > button {
    color: #eee;
    padding: 0;
  }

  .collaborator {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .collaborator > button {
    padding: 0;
  }
</style>

<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import Image from 'components/Image.svelte';
  import { ResizeImage } from 'helpers/ResizeImage';
  import { Editor, type Node } from 'state/Editor.svelte';

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="photo" ondrop={updatePhoto}>
  <div class="image">
    <Image data={data.scenario!.photo!} />
  </div>
</div>
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
<div class="description">
  <textarea
    value={data.scenario!.description}
    oninput={({ currentTarget: { value } }) => updateDescription(value)}
  ></textarea>
</div>

<style>
  .connection {
    position: relative;
  }

  .description > textarea {
    height: 8.5rem;
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
</style>

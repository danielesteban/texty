<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import Image from 'components/Image.svelte';
  import { Drag } from 'helpers/Drag';
  import { Editor, ResolutionStatus, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  let { data = $bindable() }: {
    data: typeof Editor.nodes[0];
  } = $props();

  const initialPosition = { x: 0, y: 0 };
  const dragStart = Drag(() => {
    initialPosition.x = data.position!.x!;
    initialPosition.y = data.position!.y!;
  }, (movement) => {
    data.position!.x = initialPosition.x + movement.x;
    data.position!.y = initialPosition.y + movement.y;
  });

  const getWorldPosition = (position: { x: number; y: number }) => ({
    x: position.x - window.innerWidth * 0.5 - Editor.camera.x,
    y: position.y - window.innerHeight * 0.5 - Editor.camera.y,
  });

  let outputs: { id: string; position: { x: number; y: number } }[] = [];
  let output: typeof outputs[0] | null = null;
  const wiringStart = (node: Node, response: number) => Drag((pointer) => {
    if (node.message) {
      delete node.message!.responses![response].next;
    }
    if (node.scenario) {
      delete node.scenario!.start;
    }
    const position = getWorldPosition(pointer);
    Editor.wire = { node, response, position: { x: position.x, y: position.y}, ready: false };
    initialPosition.x = position.x;
    initialPosition.y = position.y;
    const connectors = document.querySelectorAll('[data-wiring-id]');
    for (const connector of connectors) {
      const id = connector.getAttribute('data-wiring-id')!;
      const { x, y, width, height } = connector.getBoundingClientRect();
      outputs.push({ id, position: getWorldPosition({ x: x + width * 0.5, y: y + height * 0.5 }) });
    }
  }, (movement) => {
    // @dani @hack: This won't work when/if I add zoom/transform to the camera!!
    Editor.wire!.position.x = initialPosition.x + movement.x;
    Editor.wire!.position.y = initialPosition.y + movement.y;
    output = outputs.find(({ position }) => (
      Math.sqrt((position.x - Editor.wire!.position.x) ** 2 + (position.y - Editor.wire!.position.y) ** 2) < 16
    )) || null;
    if (output) {
      Editor.wire!.position.x = output.position.x;
      Editor.wire!.position.y = output.position.y;
      Editor.wire!.ready = true;
    } else {
      Editor.wire!.ready = false;
    }
  }, () => {
    if (output) {
      if (Editor.wire!.node.message) {
          Editor.wire!.node.message!.responses![Editor.wire!.response].next = output.id;
      }
      if (Editor.wire!.node.scenario) {
        Editor.wire!.node.scenario!.start = output.id;
      }
    }
    Editor.wire = null;
    outputs.length = 0;
  });
</script>

<div
  class="node"
  onpointerdown={dragStart}
  style="left: {data.position!.x!}px; top: {data.position!.y!}px"
>
  {#if data.message}
    <div class="connection">
      <Connector
        position="left"
        wiringId={data.id!}
      />
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>{Lang.current.message}</label>
    </div>
    <div class="text">
      <textarea bind:value={data.message!.text!}></textarea>
    </div>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>{Lang.current.responses}</label>
    {#each data.message!.responses! as response, index}
      <div class="connection response">
        <textarea bind:value={response.text!}></textarea>
        <Connector
          position="right"
          onpointerdown={wiringStart(data, index)}
        />
      </div>
    {/each}
  {/if}
  {#if data.resolution}
    <div class="connection">
      <Connector
        position="left"
        wiringId={data.id!}
      />
      <select bind:value={data.resolution!.status!}>
        <option value={ResolutionStatus.BLOCKED}>{Lang.current.blocked}</option>
        <option value={ResolutionStatus.DATE}>{Lang.current.date}</option>
        <option value={ResolutionStatus.FRIENDZONED}>{Lang.current.friendzoned}</option>
      </select>
    </div>
  {/if}
  {#if data.scenario}
    <div class="photo">
      <div class="image">
        <Image data={data.scenario!.photo!} />
      </div>
    </div>
    <div class="connection">
      <input type="text" bind:value={data.scenario!.name!} />
      <Connector
        position="right"
        onpointerdown={wiringStart(data, 0)}
      />
    </div>
    <div class="description">
      <textarea bind:value={data.scenario!.description}></textarea>
    </div>
  {/if}
</div>

<style>
  .node {
    box-sizing: border-box;
    position: absolute;
    width: 300px;
    background: #111;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
  }

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

  .response > textarea {
    height: 4rem;
  }

  .text > textarea {
    height: 6rem;
  }
</style>

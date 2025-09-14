<script lang="ts">
  import { untrack } from 'svelte';
  import AddNode from 'components/AddNode.svelte';
  import Connections from 'components/Connections.svelte';
  import EditNode from 'components/EditNode.svelte';
  import Node from 'components/Node.svelte';
  import { Drag } from 'helpers/Drag';
  import { Editor } from 'state/Editor.svelte';

  let origin = $state({ x: 0, y: 0 });
  const onResize = () => {
    origin.x = window.innerWidth * 0.5;
    origin.y = window.innerHeight * 0.5;
  };
  onResize();

  const initialCamera = { x: 0, y: 0 };
  const panCameraStart = Drag(() => {
    initialCamera.x = Editor.camera.x;
    initialCamera.y = Editor.camera.y;
    Editor.addingNode = null;
    Editor.editingNode = null;
  }, (movement) => {
    Editor.camera.x = initialCamera.x + movement.x;
    Editor.camera.y = initialCamera.y + movement.y;
  }, undefined, (pointer) => {
    Editor.addingNode = Editor.getWorldPosition(pointer);
  });

  const prevent = (e: Event) => e.preventDefault();

  // @dani @hack Figure out a better way to do this shit
  let lastSave;
  let timer: NodeJS.Timeout;
  $effect(() => {
    clearTimeout(timer);
    const current = JSON.stringify(Editor.nodes);
    if (lastSave === current) {
      return;
    }
    if (untrack(() => Editor.updatedFromServer)) {
      return;
    }
    timer = setTimeout(() => {
      Editor.save();
    }, 1000);
  });
</script>

<svelte:window
  oncontextmenu={prevent}
  onresize={onResize}
  ondragenter={prevent}
  ondragover={prevent}
  ondrop={prevent}
/>

<div
  class="editor"
  onpointerdown={panCameraStart}
>
  <Connections />
  <div
    class="viewport"
    style="left: {origin.x + Editor.camera.x}px; top: {origin.y + Editor.camera.y}px"
  >
    {#each Editor.nodes as _, i}
      <Node bind:data={Editor.nodes[i]} />
    {/each}
    <AddNode />
    <EditNode />
  </div>
</div>

<style>
  .editor {
    height: 100%;
    background-size: 48px 48px;
    background-image:
      linear-gradient(to right, #222 1px, transparent 1px),
      linear-gradient(to bottom, #222 1px, transparent 1px);
  }

  .viewport {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

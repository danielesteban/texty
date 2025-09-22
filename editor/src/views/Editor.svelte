<script lang="ts">
  import Connections from 'components/Connections.svelte';
  import CreateNode from 'components/CreateNode.svelte';
  import EditNode from 'components/EditNode.svelte';
  import Node from 'components/Node.svelte';
  import { Drag } from 'helpers/Drag';
  import { Editor } from 'state/Editor.svelte';

  const onResize = () => {
    Editor.origin.x = window.innerWidth * 0.5;
    Editor.origin.y = window.innerHeight * 0.5;
  };
  onResize();

  const initialCamera = { x: 0, y: 0 };
  const panCameraStart = Drag({
    onStart() {
      initialCamera.x = Editor.camera.x;
      initialCamera.y = Editor.camera.y;
      Editor.creatingNode = null;
      Editor.editingNode = null;
    },
    onMove(_, movement) {
      Editor.camera.x = initialCamera.x + movement.x;
      Editor.camera.y = initialCamera.y + movement.y;
    },
    onSecondary(pointer) {
      Editor.creatingNode = Editor.getWorldPosition(pointer);
    },
  });

  const prevent = (e: Event) => e.preventDefault();
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
    style="left: {Editor.origin.x + Editor.camera.x}px; top: {Editor.origin.y + Editor.camera.y}px"
  >
    {#each Editor.nodes as data (data.id)}
      <Node {data} />
    {/each}
    <CreateNode />
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

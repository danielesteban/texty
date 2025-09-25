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
      initialCamera.x = Editor.camera.position.x;
      initialCamera.y = Editor.camera.position.y;
      Editor.creatingNode = null;
      Editor.editingNode = null;
    },
    onMove(_, movement) {
      Editor.camera.position.x = initialCamera.x + movement.x;
      Editor.camera.position.y = initialCamera.y + movement.y;
    },
    onSecondary(pointer) {
      Editor.creatingNode = Editor.getWorldPosition(pointer);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey)
      && (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_')
    ) {
      e.preventDefault();
    }
  };

  const minZoom = Math.log(1/8);
  const maxZoom = Math.log(1);
  const zoomRange = maxZoom - minZoom;
  const zoomFromLog = (value: number) => Math.exp(minZoom + value * zoomRange);
  const zoomToLog = (value: number) => (Math.log(value) - minZoom) / zoomRange;
  const offset = { x: 0, y: 0 };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
    const step = Math.sign(e.deltaY) * -0.1;
    offset.x = e.clientX - Editor.origin.x;
    offset.y = e.clientY - Editor.origin.y;
    Editor.camera.position.x = (Editor.camera.position.x - offset.x) / Editor.camera.zoom;
    Editor.camera.position.y = (Editor.camera.position.y - offset.y) / Editor.camera.zoom;
    Editor.camera.zoom = zoomFromLog(Math.min(Math.max(zoomToLog(Editor.camera.zoom) + step, 0), 1));
    Editor.camera.position.x = (Editor.camera.position.x * Editor.camera.zoom) + offset.x;
    Editor.camera.position.y = (Editor.camera.position.y * Editor.camera.zoom) + offset.y;
  };

  $effect(() => {
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  });

  const prevent = (e: Event) => e.preventDefault();
</script>

<svelte:window
  oncontextmenu={prevent}
  onkeydown={onKeyDown}
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
    style="left: {Editor.origin.x + Editor.camera.position.x}px; top: {Editor.origin.y + Editor.camera.position.y}px; transform: scale({Editor.camera.zoom})"
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

<script lang="ts">
  import NodeMessage from 'components/NodeMessage.svelte';
  import NodeResolution from 'components/NodeResolution.svelte';
  import NodeScenario from 'components/NodeScenario.svelte';
  import { Drag } from 'helpers/Drag';
  import { Editor, type Node } from 'state/Editor.svelte';

  let { data }: {
    data: Node;
  } = $props();

  const initialPosition = { x: 0, y: 0 };
  const dragStart = Drag({
    onStart() {
      initialPosition.x = data.position!.x!;
      initialPosition.y = data.position!.y!;
      Editor.creatingNode = null;
      Editor.editingNode = null;
    },
    onMove(_, movement) {
      Editor.update({
        setPosition: {
          id: data.id!,
          value: {
            x: initialPosition.x + movement.x / Editor.camera.zoom,
            y: initialPosition.y + movement.y / Editor.camera.zoom,
          },
        },
      });
    },
    onSecondary(pointer) {
      if (data.scenario) {
        return;
      }
      Editor.editingNode = {
        id: data.id!,
        ...Editor.getWorldPosition(pointer),
      };
    },
  });

  let outputs: { id: string; position: { x: number; y: number } }[] = [];
  let output: typeof outputs[0] | null = null;
  const wiringStart = (node: Node, response: number = 0) => Drag({
    onStart(pointer) {
      if (node.message) {
        Editor.update({
          setMessageReponseNext: {
            id: node.id!,
            child: response,
            value: undefined,
          },
        });
      }
      if (node.scenario) {
        Editor.update({
          setScenarioStart: {
            id: node.id!,
            value: undefined,
          },
        });
      }
      const position = Editor.getWorldPosition(pointer);
      Editor.wire = { node, response, position: { x: position.x, y: position.y }, ready: false };
      initialPosition.x = position.x;
      initialPosition.y = position.y;
      const connectors = document.querySelectorAll('[data-wiring-id]');
      for (const connector of connectors) {
        const id = connector.getAttribute('data-wiring-id')!;
        const { x, y, width, height } = connector.getBoundingClientRect();
        outputs.push({ id, position: Editor.getWorldPosition({ x: x + width * 0.5, y: y + height * 0.5 }) });
      }
    },
    onMove(_, movement) {
      Editor.wire!.position.x = initialPosition.x + movement.x / Editor.camera.zoom;
      Editor.wire!.position.y = initialPosition.y + movement.y / Editor.camera.zoom;
      output = outputs.find(({ position }) => (
        ((position.x - Editor.wire!.position.x) ** 2 + (position.y - Editor.wire!.position.y) ** 2) < 576
      )) || null;
      if (output) {
        Editor.wire!.position.x = output.position.x;
        Editor.wire!.position.y = output.position.y;
        Editor.wire!.ready = true;
      } else {
        Editor.wire!.ready = false;
      }
    },
    onEnd() {
      if (output) {
        if (Editor.wire!.node.message) {
          Editor.update({
            setMessageReponseNext: {
              id: Editor.wire!.node.id!,
              child: Editor.wire!.response,
              value: output.id,
            },
          });
        }
        if (Editor.wire!.node.scenario) {
          Editor.update({
            setScenarioStart: {
              id: Editor.wire!.node.id!,
              value: output.id,
            },
          });
        }
      }
      Editor.wire = null;
      outputs.length = 0;
      output = null;
    },
  });
</script>

<div
  class="node"
  onpointerdown={dragStart}
  style="left: {data.position!.x!}px; top: {data.position!.y!}px"
>
  {#if data.message}
    <NodeMessage {data} {wiringStart} />
  {/if}
  {#if data.resolution}
    <NodeResolution {data} />
  {/if}
  {#if data.scenario}
    <NodeScenario {data} {wiringStart} />
  {/if}
</div>

<style>
  .node {
    box-sizing: border-box;
    position: absolute;
    width: 300px;
    background: #111;
    border: 1px solid #000;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
  }
</style>

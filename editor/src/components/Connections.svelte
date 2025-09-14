<script lang="ts">
  import { Editor, type Node } from 'state/Editor.svelte';

  let canvas: HTMLCanvasElement = null!;

  const getInputPosition = (node: Node) => {
    if (node.resolution) {
      return { x: node.position!.x!, y: node.position!.y! + 32 };
    }
    return { x: node.position!.x!, y: node.position!.y! + 25 };
  };

  const getOutputPosition = (node: Node, response: number) => {
    if (node.message) {
      return { x: node.position!.x! + 300, y: node.position!.y! + 204 + (response * 72) };
    }
    if (node.scenario) {
      return { x: node.position!.x! + 300, y: node.position!.y! + 176 };      
    }
    return { x: node.position!.x!, y: node.position!.y! };
  };

  const drawWire = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    const offset = Math.sqrt((from.x - to.x) ** 2) / 3;
    const cp1 = { x: from.x + offset, y: from.y };
    const cp2 = { x: to.x - offset, y: to.y };
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#99e';
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#339';
    ctx.stroke();
  };

  const draw = () => {
    if (!canvas) {
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(window.innerWidth * 0.5 + Editor.camera.x, window.innerHeight * 0.5 + Editor.camera.y);
    Editor.nodes.forEach((node) => {
      if (node.message) {
        node.message!.responses!.forEach(({ next }, i) => {
          if (!next) {
            return;
          }
          const destination = Editor.nodes.find(({ id }) => id === next)!;
          const from = getOutputPosition(node, i);
          const to = getInputPosition(destination);
          drawWire(ctx, from, to);
        });
      }
      if (node.scenario) {
        if (!node.scenario!.start) {
          return;
        }
        const destination = Editor.nodes.find(({ id }) => id === node.scenario!.start)!;
        const from = getOutputPosition(node, 0);
        const to = getInputPosition(destination);
        drawWire(ctx, from, to);
      }
    });
    if (Editor.wire) {
      const from = getOutputPosition(Editor.wire.node, Editor.wire.response);
      !Editor.wire.ready && ctx.setLineDash([5, 5]);
      drawWire(ctx, from, Editor.wire.position);
      ctx.setLineDash([]);
    }
  };
  $effect(draw);
</script>

<svelte:window onresize={draw} />

<canvas bind:this={canvas} class="connections"></canvas>

<style>
  .connections {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
</style>

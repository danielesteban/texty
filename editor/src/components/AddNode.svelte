<script lang="ts">
  import { Editor, ResolutionStatus, type Node } from 'state/Editor.svelte';
  import { v4 as uuid } from 'uuid';

  const addNode = (type: 'message' | 'resolution') => () => {
    let node: Node = {
      id: uuid(),
      position: {
        x: Editor.addingNode!.x,
        y: Editor.addingNode!.y,
      },
    };
    if (type === 'message') {
      node.message = {
        text: '',
        responses: [
          { text: '' },
          { text: '' },
          { text: '' },
        ],
      };
    }
    if (type === 'resolution') {
      node.resolution = {
        status: ResolutionStatus.BLOCKED,
      };
    }
    Editor.nodes.push(node);
    Editor.addingNode = null;
  };
</script>

{#if Editor.addingNode}
  <div
    class="menu"
    onpointerdown={(e) => e.stopPropagation()}
    style="top: {Editor.addingNode.y}px; left: {Editor.addingNode.x}px"
  >
    <button onclick={addNode('message')}>
      Message
    </button>
    <button onclick={addNode('resolution')}>
      Resolution
    </button>
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    width: 100px;
    background: #111;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
  }
</style>

<script lang="ts">
  import ContextMenu from 'components/ContextMenu.svelte';
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

<ContextMenu position={Editor.addingNode}>
  <button onclick={addNode('message')}>
    Message
  </button>
  <button onclick={addNode('resolution')}>
    Resolution
  </button>
</ContextMenu>


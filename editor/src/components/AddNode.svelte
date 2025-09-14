<script lang="ts">
  import { v4 as uuid } from 'uuid';
  import ContextMenu from 'components/ContextMenu.svelte';
  import { Editor, ResolutionStatus, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

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
    {Lang.current.message}
  </button>
  <button onclick={addNode('resolution')}>
    {Lang.current.resolution}
  </button>
</ContextMenu>

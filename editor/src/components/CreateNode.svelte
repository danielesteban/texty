<script lang="ts">
  import { v4 as uuid } from 'uuid';
  import ContextMenu from 'components/ContextMenu.svelte';
  import { Editor, ResolutionStatus, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  const createNode = (type: 'message' | 'resolution') => () => {
    let node: Node = {
      id: uuid(),
      position: {
        x: Editor.creatingNode!.x,
        y: Editor.creatingNode!.y,
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
    Editor.update({
      create: node,
    });
    Editor.creatingNode = null;
  };
</script>

<ContextMenu position={Editor.creatingNode}>
  <button onclick={createNode('message')}>
    {Lang.current.message}
  </button>
  <button onclick={createNode('resolution')}>
    {Lang.current.resolution}
  </button>
</ContextMenu>

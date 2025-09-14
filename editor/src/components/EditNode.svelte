<script lang="ts">
  import ContextMenu from 'components/ContextMenu.svelte';
  import { Editor } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  const removeNode = () => {
    Editor.nodes.splice(Editor.nodes.findIndex(({ id }) => id === Editor.editingNode!.id), 1);
    Editor.nodes.forEach((node) => {
      if (node.message) {
        node.message.responses!.forEach((response) => {
          if (response.next === Editor.editingNode!.id) {
            delete response.next;
          }
        });
      }
      if (node.scenario) {
        if (node.scenario.start === Editor.editingNode!.id) {
          delete node.scenario.start;
        }
      }
    });
    Editor.editingNode = null;
  };
</script>

<ContextMenu position={Editor.editingNode}>
  <button onclick={removeNode}>
    {Lang.current.remove}
  </button>
</ContextMenu>


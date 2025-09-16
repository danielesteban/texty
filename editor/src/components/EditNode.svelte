<script lang="ts">
  import ContextMenu from 'components/ContextMenu.svelte';
  import { Editor } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  const removeNode = () => {
    Editor.update({
      remove: Editor.editingNode!.id,
    });
  };
</script>

<ContextMenu position={Editor.editingNode}>
  <button onclick={removeNode}>
    {Lang.current.remove}
  </button>
</ContextMenu>

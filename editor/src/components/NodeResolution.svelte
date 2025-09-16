<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import { Editor, ResolutionStatus, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  let { data }: {
    data: Node;
  } = $props();

  const updateStatus = (value: ResolutionStatus) => {
    Editor.update({
      setResolutionStatus: {
        id: data.id!,
        value,
      },
    });
  };

  const updateText = (value: string) => {
    Editor.update({
      setResolutionText: {
        id: data.id!,
        value,
      },
    });
  };
</script>

<div class="connection">
  <Connector
    position="left"
    wiringId={data.id!}
  />
  <!-- svelte-ignore a11y_label_has_associated_control -->
  <label>{Lang.current.status}</label>
</div>
<select
  value={data.resolution!.status!}
  onchange={({ currentTarget: { value } }) => updateStatus(parseInt(value, 10))}
>
  <option value={ResolutionStatus.BLOCKED}>{Lang.current.blocked}</option>
  <option value={ResolutionStatus.DATE}>{Lang.current.date}</option>
  <option value={ResolutionStatus.FRIENDZONED}>{Lang.current.friendzoned}</option>
  <option value={ResolutionStatus.REJECTED}>{Lang.current.rejected}</option>
</select>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.message}</label>
<div class="text">
  <textarea
    value={data.resolution!.text!}
    oninput={({ currentTarget: { value } }) => updateText(value)}
  ></textarea>
</div>

<style>
  .connection {
    position: relative;
  }

  .text > textarea {
    height: 4.5rem;
  }
</style>

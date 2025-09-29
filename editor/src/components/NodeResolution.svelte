<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import { Editor, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  let { data }: {
    data: Node;
  } = $props();

  const updateMessage = (value: string) => {
    Editor.update({
      setResolutionMessage: {
        id: data.id!,
        value,
      },
    });
  };

  const updateResult = (value: string) => {
    Editor.update({
      setResolutionResult: {
        id: data.id!,
        value,
      },
    });
  };

  const updateStatus = (value: boolean) => {
    Editor.update({
      setResolutionStatus: {
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
<div class="options">
  <label class="option" data-no-drag>
    <input
      name="status"
      type="radio"
      checked={data.resolution!.status}
      value={true}
      onchange={({ currentTarget: { checked } }) => updateStatus(checked)}
    />
    <div>
      {Lang.current.success}
    </div>
  </label>
  <label class="option" data-no-drag>
    <input
      name="status"
      type="radio"
      checked={!data.resolution!.status}
      value={false}
      onchange={({ currentTarget: { checked } }) => updateStatus(!checked)}
    />
    <div>
      {Lang.current.failure}
    </div>
  </label>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.result}</label>
<div class="text">
  <input
    type="text"
    spellcheck={false}
    value={data.resolution!.result!}
    oninput={({ currentTarget: { value } }) => updateResult(value)}
  />
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.message}</label>
<div class="text">
  <textarea
    spellcheck={false}
    value={data.resolution!.message!}
    oninput={({ currentTarget: { value } }) => updateMessage(value)}
  ></textarea>
</div>

<style>
  .connection {
    position: relative;
  }

  .text > textarea {
    height: 4.5rem;
  }

  .options {
    display: grid;
    gap: 0.25rem;
    justify-items: flex-start;
  }
  
  .option {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    color: #eee;
    cursor: pointer;
  }

  .option > div {
    padding-right: 0.5rem;
    pointer-events: none;
  }
</style>

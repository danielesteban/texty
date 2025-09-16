<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import { Editor, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';

  let { data, wiringStart }: {
    data: Node;
    wiringStart: (node: Node, response: number) => (e: PointerEvent) => void;
  } = $props();

  const updateText = (value: string) => {
    Editor.update({
      setMessageText: {
        id: data.id!,
        value,
      },
    });
  };

  const updateResponseText = (response: number, value: string) => {
    Editor.update({
      setMessageReponseText: {
        id: data.id!,
        child: response,
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
  <label>{Lang.current.message}</label>
</div>
<div class="text">
  <textarea
    value={data.message!.text!}
    oninput={({ currentTarget: { value } }) => updateText(value)}
  ></textarea>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.responses}</label>
{#each data.message!.responses! as response, index}
  <div class="connection response">
    <textarea
      value={response.text!}
      oninput={({ currentTarget: { value } }) => updateResponseText(index, value)}
    ></textarea>
    <Connector
      position="right"
      onpointerdown={wiringStart(data, index)}
    />
  </div>
{/each}

<style>
  .connection {
    position: relative;
  }

  .response > textarea, .text > textarea {
    height: 4.5rem;
  }
</style>

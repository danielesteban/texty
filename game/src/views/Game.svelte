<script lang="ts">
  import Image from 'components/Image.svelte';
  import { ResolutionStatus, Scenario, type INode as Node, type INodeMessageResponses, type IScenario } from '../../../protocol/messages.js';

  let hasLoaded = $state(false);
  let isDone = $state(false);
  let isTyping = $state(false);

  let nodes = $state<Node[]>([]);

  let messages = $state<{ text: string; type: 'incoming' | 'outgoing' }[]>([]);

  let scenario = $state<Node>({});

  let responses = $state<INodeMessageResponses[]>([]);


  const loadNode = (id: string) => {
    isTyping = true;
    setTimeout(() => {
      responses = [];
      const node = nodes.find((node) => node.id === id)!!;
      if (node.message) {
        messages.push({ text: node.message.text!, type: 'incoming' });
        responses = node.message!.responses!;
      }
      if (node.resolution) {
        messages.push({ text: ResolutionStatus[node.resolution.status!], type: 'incoming' });
        isDone = true;
      }
      isTyping = false;
    }, 1000);
  };

  const respond = (response: INodeMessageResponses) => {
    messages.push({ text: response.text!, type: 'outgoing' });
    loadNode(response.next!);
  };

  fetch(`${__SERVER__}scenario`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.arrayBuffer();
    })
    .then((data) => {
      const parsed = Scenario.toObject(Scenario.decode(new Uint8Array(data))) as IScenario;
      nodes = parsed.nodes!;

      scenario = nodes.find((node) => !!node.scenario)!;

      hasLoaded = true;
      loadNode(scenario.scenario!.start!);
    })
    .catch(() => {
      console.log('error loading!');
    });
</script>

{#if hasLoaded}
  <div class="game">
    <div class="info">
      <div class="photo">
        <div class="image">
          <Image data={scenario.scenario!.photo!} />
        </div>
      </div>
      {scenario.scenario!.name}
    </div>
    <div class="messages">
      {#each messages as message}
        <div>
          <div class="message {message.type}">{message.text}</div>
        </div>
      {/each}
      {#if isTyping}
        <div>
          {scenario.scenario?.name} is typing...
        </div>
      {/if}
    </div>
    <div class="responses">
      {#each responses as response}
        <div class="response">
          {#if response.text && response.next}
            <button
              disabled={isTyping}
              onclick={() => respond(response)}
            >
              {response.text}
            </button>
          {/if}
        </div>
      {/each}
      {#if isDone}
        <div class="response">
          <button onclick={() => {
            isDone = false;
            messages = [];
            loadNode(scenario.scenario!.start!);
          }}>
            RESET GAME
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .game {
    background: #222;
    border-radius: 0.5rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }

  .info {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1rem;
    background: #000;
    padding: 0.5rem 1rem;
  }

  .photo {
    display: grid;
    justify-content: center;
  }

  .image {
    width: 4rem;
    height: 4rem;
    border: 4px solid #222;
    border-radius: 8rem;
    pointer-events: none;
    overflow: hidden;
  }

  .messages {
    display: grid;
    align-content: flex-start;
    gap: 0.5rem;
    padding: 1rem;
  }

  .message {
    padding: 0.5rem;
    background: #333;
    border-radius: 0.5rem;
  }

  .message.incoming {
    float: left;
  }

  .message.outgoing {
    float: right;
  }

  .responses {
    display: grid;
    padding: 1rem;
    gap: 0.5rem;
    background: #333;
    border-top: 1px solid #000;
  }
  
  .response {
    display: grid;
  }
  .response > button {
    justify-content: flex-start;
  }
</style>

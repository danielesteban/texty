<script lang="ts">
  import { tick } from 'svelte';
  import Image from 'components/Image.svelte';
  import { Game } from 'state/Game.svelte';
  import { Lang } from 'state/Lang.svelte';

  let messages = $state<HTMLDivElement>(null!);

  $effect.pre(() => {
		if (!messages) return;

    Game.isTyping;
		Game.messages.length;

		if (messages.offsetHeight + messages.scrollTop > messages.scrollHeight - 20) {
			tick().then(() => {
				messages.scrollTo(0, messages.scrollHeight);
			});
		}
	});
</script>

<div class="game">
  <div class="info">
    <div class="photo">
      <div class="image">
        <Image data={Game.scenario.scenario!.photo!} />
      </div>
    </div>
    {Game.scenario.scenario!.name}
  </div>
  <div bind:this={messages} class="messages">
    {#each Game.messages as message}
      <div>
        <div class="message {message.type}">{message.text}</div>
      </div>
    {/each}
    {#if Game.isTyping}
      <div class="typing">
        {Lang.current.isTyping.replace('{name}', Game.scenario.scenario!.name!)}
      </div>
    {/if}
  </div>
  <div class="responses">
    {#each Game.responses as response}
      {#if response.text && response.next}
        <div class="response">
          <button
            disabled={Game.isTyping}
            onclick={() => Game.respond(response)}
          >
            {response.text}
          </button>
        </div>
      {/if}
    {/each}
    {#if Game.isDone}
      <div class="response">
        <button class="reset" onclick={Game.reset}>
          {Lang.current.resetGame}
        </button>
      </div>
    {/if}
  </div>
</div>

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
    overflow-y: auto;
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

  .typing {
    padding: 0.5rem 0;
  }

  .responses {
    display: grid;
    padding: 1rem;
    gap: 0.5rem;
    background: #333;
    border-top: 1px solid #000;
    box-sizing: border-box;
    min-height: 9rem;
    align-content: center;
  }
  
  .response {
    display: grid;
  }

  .response > button {
    justify-content: flex-start;
  }

  .response > button.reset {
    justify-content: center;
  }
</style>

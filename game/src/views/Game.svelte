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
        <div class="message {message.type}">
          <div class="arrow"></div>
          {message.text}
        </div>
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
    background: #1a1a1a;
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
    background: #111;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #000;
    font-size: 1rem;
    line-height: 1.5rem;
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
    position: relative;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .message > .arrow {
    position: absolute;
    top: 0;
    width: 0.5rem;
    height: 0.5rem;
    overflow: hidden;
  }

  .message > .arrow::before {
    position: absolute;
    top: -0.5rem;
    left: 0;
    content: '';
    width: 0;
    height: 0;
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent; 
  }
  
  .message.incoming {
    float: left;
    background: #242626;
    border-top-left-radius: 0;
  }

  .message.incoming > .arrow {
    left: -0.5rem;
  }

  .message.incoming > .arrow::before {
    border-right: 0.5rem solid #242626; 
  }

  .message.outgoing {
    float: right;
    background: #144d37;
    border-top-right-radius: 0;
  }

  .message.outgoing > .arrow {
    right: -0.5rem;
  }

  .message.outgoing > .arrow::before {
    border-left: 0.5rem solid #144d37; 
  }

  .typing {
    padding: 0.5rem 0;
  }

  .responses {
    display: grid;
    padding: 1rem;
    gap: 0.5rem;
    background: #242626;
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

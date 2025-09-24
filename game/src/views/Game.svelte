<script lang="ts">
  import { tick } from 'svelte';
  import Image from 'components/Image.svelte';
  import Text from 'components/Text.svelte';
  import { Game } from 'state/Game.svelte';
  import { Lang } from 'state/Lang.svelte';

  let messages = $state<HTMLDivElement>(null!);

  $effect.pre(() => {
		if (!messages) return;

    Game.isTyping;
		Game.messages.length;
		Game.resolution;

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
          <Text value={message.text} />
        </div>
      </div>
    {/each}
    {#if Game.isTyping}
      <div class="typing">
        {Lang.current.isTyping.replace('{name}', Game.scenario.scenario!.name!)}
      </div>
    {/if}
    {#if Game.resolution !== null}
      <div class="resolution" class:success={Game.resolution.status}>
        {Game.resolution.result}
      </div>
    {/if}
  </div>
  {#if Game.resolution !== null}
    <div class="options">
      <button class="option" onclick={Game.reset}>
        <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23,12A11,11,0,1,1,12,1a10.9,10.9,0,0,1,5.882,1.7l1.411-1.411A1,1,0,0,1,21,2V6a1,1,0,0,1-1,1H16a1,1,0,0,1-.707-1.707L16.42,4.166A8.9,8.9,0,0,0,12,3a9,9,0,1,0,9,9,1,1,0,0,1,2,0Z"/>
        </svg>
        {Lang.current.tryAgain}
      </button>
      <a href="#/" class="link">
        <button class="option">
          <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z"/>
          </svg>
          {Lang.current.tryAnother}
        </button>
      </a>
    </div>
  {:else if Game.responses.length}
    <div class="chat">
      <div class="responses">
        {#each Game.responses as response, i}
          {#if response.text && response.next}
            <label class="response" class:disabled={Game.isTyping} class:selected={Game.selected === i}>
              <input name="response" type="radio" value={i} bind:group={Game.selected} disabled={Game.isTyping} />
              <div>
                <Text value={response.text} />
              </div>
            </label>
          {/if}
        {/each}
      </div>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="send" onclick={() => Game.respond(Game.responses[Game.selected])} disabled={Game.isTyping || Game.selected === -1}>
        <svg width="1.5rem" height="1.5rem" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.9,23.2l-38-18L6,5A2,2,0,0,0,4,7L9.3,23H24a2.1,2.1,0,0,1,2,2,2,2,0,0,1-2,2H9.3L4,43a2,2,0,0,0,2,2l.9-.2,38-18A2,2,0,0,0,44.9,23.2Z"/>
        </svg>
      </button>
    </div>
  {/if}
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
    padding: 1rem 1.5rem;
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

  @keyframes resolution {
    0% { rotate: -13deg; }
    50% { rotate: -7deg; }
    100% { rotate: -13deg; }
  }

  .resolution {
    margin: 3.5rem 2rem 2.5rem;
    display: grid;
    justify-content: center;
    border: 4px solid #4d3714;
    border-radius: 0.5rem;
    background: #242626;
    padding: 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
    rotate: -10deg;
    animation-name: resolution;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
  }

  .resolution.success {
    border-color: #144d37;
  }

  .typing {
    padding: 0.5rem 0;
  }

  .chat {
    display: grid;
    grid-template-columns: 1fr auto;
    background: #242626;
    border-top: 1px solid #000;
  }

  .responses {
    display: grid;
    border-right: 1px solid #000;
  }
  
  .response {
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 0.75rem 1rem;
    gap: 0.75rem;
    color: #eee;
    border-top: 1px solid #111;
    cursor: pointer;
  }

  .response.disabled {
    color: #666;
  }

  .response.selected {
    color: #21c063;
  }

  .response:first-child {
    border-top: none;
  }

  .response > div {
    display: grid;
    align-items: center;
  }

  .send {
    padding: 0 1.5rem;
    background: #21c063;
    border: 0;
    border-radius: 0;
  }

  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
    gap: 1rem;
    background: #242626;
    border-top: 1px solid #000;
  }

  .option {
    flex-direction: column;
    gap: 0.75rem;
  }

  .link {
    display: grid;
    text-decoration: none;
  }
</style>

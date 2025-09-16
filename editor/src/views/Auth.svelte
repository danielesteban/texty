<script lang="ts">
  import { Lang } from 'state/Lang.svelte';
  import { User } from 'state/User.svelte';

  let isSending = false;
  let isSignUp = false;
  let hasError = false;

  let name = '';
  let password = '';
  let confirmPassword = '';
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    if (
      !name
      || !password
      || (isSignUp && password !== confirmPassword)
    ) {
      return;
    }
    hasError = false;
    isSending = true;
    User[isSignUp ? 'register' : 'login'](name, password)
      .catch(() => {
        hasError = true;
      })
      .finally(() => {
        isSending = false;
      });
  };
  const toggle = () => {
    isSignUp = !isSignUp;
  };
</script>

<div class="auth">
  <form onsubmit={submit}>
    <div class="header">
      {isSignUp ? Lang.current.signup : Lang.current.signin}
    </div>
    <div>
      <input
        bind:value={name}
        type="text"
        spellcheck={false}
        placeholder={Lang.current.username}
        autocomplete="username"
      />
    </div>
    <div>
      <input
        bind:value={password}
        type="password"
        spellcheck={false}
        placeholder={Lang.current.password}
        autocomplete={isSignUp ? 'new-password' : 'current-password'}
      />
    </div>
    {#if isSignUp}
      <div>
        <input
          bind:value={confirmPassword}
          type="password"
          spellcheck={false}
          placeholder={Lang.current.confirmPassword}
          autocomplete="new-password"
        />
      </div>
    {/if}
    <div class="submit">
      <button
        disabled={isSending}
        type="submit"
      >
        {isSignUp ? Lang.current.signup : Lang.current.signin}
      </button>
    </div>
    <div class="alt">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_missing_attribute -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <a onclick={toggle}>
        {isSignUp ? Lang.current.signupAlternative : Lang.current.signinAlternative}
      </a>
    </div>
    {#if hasError}
      <div class="error">
        {isSignUp ? Lang.current.signupError : Lang.current.signinError}
      </div>
    {/if}
  </form>
</div>

<style>
  .auth {
    height: 100%;
    display: grid;
    place-items: center;
  }

  .auth > form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .header {
    font-size: 2em;
    line-height: 2em;
  }

  .submit {
    margin: 0.5rem 0;
  }

  .alt {
    color: #bbb;
    margin: 0.5rem 0;
  }

  .error {
    color: #ebb;
  }
</style>

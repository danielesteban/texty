<script lang="ts">
  let { onpointerdown, position, wiringId }: {
    onpointerdown?: (e: PointerEvent) => void;
    position: 'left' | 'right';
    wiringId?: string;
  } = $props();
</script>

<div
  class="connector {position}"
  data-wiring-id={wiringId}
  onpointerdown={onpointerdown}
></div>

<style>
  .connector {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    background: #339;
    border: 1px solid #eee;
  }

  .connector.left {
    left: -1.5rem;
  }

  .connector.right {
    right: -1.5rem;
  }
</style>

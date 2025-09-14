import failure from 'assets/failure.mp3';
import message from 'assets/message.mp3';
import success from 'assets/success.mp3';

const context = new AudioContext();
const output = new GainNode(context, { gain: 0.4 });
output.connect(context.destination);

window.addEventListener('click', () => {
  if (context.state === 'suspended') {
    context.resume();
  }
});

const buffers: { [key: string]: AudioBuffer } = {};
[
  { id: 'failure', source: failure },
  { id: 'message', source: message },
  { id: 'success', source: success },
].forEach(async ({ id, source }) => {
  const res = await fetch(source);
  if (!res.ok) {
    return;
  }
  const buffer = await res.arrayBuffer();
  buffers[id] = await context.decodeAudioData(buffer);
});

export const Audio = {
  play(id: string) {
    if (!buffers[id] || context.state === 'suspended') {
      return;
    }
    const source = context.createBufferSource();
    source.buffer = buffers[id];
    source.connect(output);
    source.start();
  },
};

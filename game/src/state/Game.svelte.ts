import { Audio } from 'state/Audio';
import { Scenario, type INode as Node, type INodeMessageResponses, type IScenario } from '../../../protocol/messages.js';

let hasLoaded = $state(false);
let isLoading = $state(false);
let isTyping = $state(false);

let nodes = $state<Node[]>([]);
let messages = $state<{ text: string; type: 'incoming' | 'outgoing' }[]>([]);
let resolution = $state<{ result: string; status: boolean } | null>(null);
let responses = $state<INodeMessageResponses[]>([]);
let scenario = $state<Node>({});
let selected = $state(-1);

let typingTimer = $state<NodeJS.Timeout>();

const typeMessage = (text: string) => {
  isTyping = true;
  return new Promise<void>((resolve) => {
    typingTimer = setTimeout(() => {
      messages.push({ text, type: 'incoming' });
      isTyping = false;
      Audio.play('message');
      resolve();
    }, 1000 + 500 * Math.random());
  });
};

const loadNode = async (id: string) => {
  selected = -1;
  const node = nodes.find((node) => node.id === id)!!;
  if (node.message) {
    if (node.message.text) {
      await typeMessage(node.message.text);
    }
    responses = node.message!.responses!;
    return;
  }
  if (node.resolution) {
    if (node.resolution.message) {
      await typeMessage(node.resolution.message!);
    }
    resolution = { result: node.resolution.result!, status: node.resolution.status! };
    responses = [];
    Audio.play(resolution.status ? 'success' : 'failure');
    return;
  }
};

export const Game = {
  get hasLoaded() { return hasLoaded },
  get isLoading() { return isLoading },
  get isTyping() { return isTyping },
  get messages() { return messages },
  get resolution() { return resolution },
  get responses() { return responses },
  get scenario() { return scenario },
  get selected() { return selected },
  set selected(value) { selected = value; },
  async load(id: string) {
    isLoading = true;
    const res = await fetch(`${__SERVER__}scenario/${id}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.arrayBuffer();
    const parsed = Scenario.toObject(Scenario.decode(new Uint8Array(data)), { defaults: true }) as IScenario;
    nodes = parsed.nodes!;
    scenario = nodes.find((node) => !!node.scenario)!;
    hasLoaded = true;
    isLoading = false;
    loadNode(scenario.scenario!.start!);
  },
  respond(response: INodeMessageResponses) {
    messages.push({ text: response.text!, type: 'outgoing' });
    loadNode(response.next!);
  },
  reset() {
    messages = [];
    resolution = null;
    loadNode(Game.scenario.scenario!.start!);
  },
  unload() {
    hasLoaded = false;
    isLoading = false;
    isTyping = false;
    nodes = [];
    messages = [];
    resolution = null;
    responses = [];
    scenario = {};
    selected = -1;
    clearTimeout(typingTimer);
  },
};

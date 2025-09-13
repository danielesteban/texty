import { ResolutionStatus, Scenario, type INode as Node, type INodeMessageResponses, type IScenario } from '../../../protocol/messages.js';

let hasLoaded = $state(false);
let isDone = $state(false);
let isTyping = $state(false);

let nodes = $state<Node[]>([]);
let messages = $state<{ text: string; type: 'incoming' | 'outgoing' }[]>([]);
let scenario = $state<Node>({});
let responses = $state<INodeMessageResponses[]>([]);

let typingTimer = $state<NodeJS.Timeout>();

const loadNode = (id: string) => {
  isTyping = true;
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
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
  }, 1000 + 500 * Math.random());
};

export const Game = {
  get hasLoaded() { return hasLoaded },
  get isDone() { return isDone },
  get isTyping() { return isTyping },
  get messages() { return messages },
  get scenario() { return scenario },
  get responses() { return responses },
  async load(id: string) {
    const res = await fetch(`${__SERVER__}scenario/${id}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.arrayBuffer();
    const parsed = Scenario.toObject(Scenario.decode(new Uint8Array(data))) as IScenario;
    nodes = parsed.nodes!;
    scenario = nodes.find((node) => !!node.scenario)!;
    hasLoaded = true;
    loadNode(scenario.scenario!.start!);
  },
  respond(response: INodeMessageResponses) {
    messages.push({ text: response.text!, type: 'outgoing' });
    loadNode(response.next!);
  },
  reset() {
    isDone = false;
    messages = [];
    loadNode(Game.scenario.scenario!.start!);
  },
  unload() {
    hasLoaded = false;
    isDone = false;
    isTyping = false;
    nodes = [];
    messages = [];
    scenario = {};
    responses = [];
    clearTimeout(typingTimer);
  },
};

import { ResolutionStatus, Scenario, type INode as Node, type INodeMessageResponses, type IScenario } from '../../../protocol/messages.js';

export { ResolutionStatus };

let hasLoaded = $state(false);
let isTyping = $state(false);

let nodes = $state<Node[]>([]);
let messages = $state<{ text: string; type: 'incoming' | 'outgoing' }[]>([]);
let scenario = $state<Node>({});
let resolution = $state<ResolutionStatus | null>(null);
let responses = $state<INodeMessageResponses[]>([]);

let typingTimer = $state<NodeJS.Timeout>();

const loadNode = (id: string) => {
  isTyping = false;
  clearTimeout(typingTimer);
  const node = nodes.find((node) => node.id === id)!!;
  if (node.message) {
    isTyping = true;
    typingTimer = setTimeout(() => {
      responses = [];
      if (node.message) {
        messages.push({ text: node.message.text!, type: 'incoming' });
        responses = node.message!.responses!;
      }
      isTyping = false;
    }, 1000 + 500 * Math.random());
    return;
  }
  if (node.resolution) {
    resolution = node.resolution.status!;
    responses = [];
    return;
  }
};

export const Game = {
  get hasLoaded() { return hasLoaded },
  get isTyping() { return isTyping },
  get messages() { return messages },
  get scenario() { return scenario },
  get resolution() { return resolution },
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
    messages = [];
    resolution = null;
    loadNode(Game.scenario.scenario!.start!);
  },
  unload() {
    hasLoaded = false;
    isTyping = false;
    nodes = [];
    messages = [];
    scenario = {};
    resolution = null;
    responses = [];
    clearTimeout(typingTimer);
  },
};

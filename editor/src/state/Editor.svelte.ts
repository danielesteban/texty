import { ResolutionStatus, Scenario, type INode as Node, type IScenario } from '../../../protocol/messages.js';
export { ResolutionStatus, type Node };
import { User } from 'state/User.svelte';
import { request } from 'state/Server';

let addingNode = $state<{ x: number; y: number } | null>(null);

let camera = $state({ x: 0, y: 0 });

let hasLoaded = $state(false);

let id = $state<string>('');

let nodes = $state<Node[]>([]);

let wire = $state<{
  node: Node;
  response: number;
  position: { x: number; y: number };
  ready: boolean;
} | null>(null);

export const Editor = {
  get addingNode() { return addingNode },
  set addingNode(value) { addingNode = value },
  get camera() { return camera },
  get hasLoaded() { return hasLoaded },
  get nodes() { return nodes },
  get wire() { return wire },
  set wire(value) { wire = value },
  async create() {
    const scenario = await request({
      method: 'POST',
      endpoint: `scenario`,
      session: User.session!,
    });
    return await this.load(scenario);
  },
  async load(scenario: string) {
    this.unload();
    return await request({
      endpoint: `scenario/${scenario}`,
    })
      .then((data) => {
        id = scenario;
        nodes = (Scenario.toObject(Scenario.decode(new Uint8Array(data))) as IScenario).nodes!;
        hasLoaded = true;
      });
  },
  async save() {
    const data = new FormData();
    // @ts-ignore
    data.append('data', new Blob([Scenario.encode({ nodes }).finish()]));
    return await request({
      body: data,
      endpoint: `scenario/${id}`,
      method: 'PUT',
      session: User.session!,
    });
  },
  async remove() {
    await request({
      endpoint: `scenario/${id}`,
      method: 'DELETE',
      session: User.session!,
    });
    location.hash = '/';
  },
  async list() {
    const scenarios = await request({
      endpoint: `scenarios`,
    });
    return scenarios;
  },
  unload() {
    addingNode = null;
    camera = { x: 0, y: 0 };
    hasLoaded = false;
    id = '';
    nodes = [];
    wire = null;
  },
};

// @dani @hack
// This is here to use it through the console until I make a UI for it
(window as any).removeCurrentScenario = () => {
  Editor.remove();
};

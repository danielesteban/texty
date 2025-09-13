import { ResolutionStatus, Scenario, type INode as Node, type IScenario } from '../../../protocol/messages.js';
export { ResolutionStatus, type Node };
import { User } from 'state/User.svelte';
import { request } from 'state/Server';

let addingNode = $state<{ x: number; y: number } | null>(null);

let camera = $state({ x: 0, y: 0 });

let hasLoaded = $state(false);

let nodes = $state<Node[]>([]);

let wire = $state<{
  node: Node;
  response: number;
  position: { x: number; y: number };
  ready: boolean;
} | null>(null);

request({
  endpoint: 'scenario',
})
  .then((data) => {
    const scenario = Scenario.toObject(Scenario.decode(new Uint8Array(data))) as IScenario;
    nodes = scenario.nodes!;
    hasLoaded = true;
  })
  .catch(() => {
    console.error('error loading!');
  });

export const Editor = {
  get addingNode() { return addingNode },
  set addingNode(value) { addingNode = value },
  get camera() { return camera },
  get hasLoaded() { return hasLoaded },
  get nodes() { return nodes },
  get wire() { return wire },
  set wire(value) { wire = value },
  save() {
    const data = new FormData();
    // @ts-ignore
    data.append('data', new Blob([Scenario.encode({ nodes }).finish()]));
    request({
      body: data,
      endpoint: 'scenario',
      method: 'PUT',
      session: User.session!,
    })
      .then(() => {
        console.log('saved!')
      })
      .catch(() => {
        console.error('error saving!');
      });
  },
};

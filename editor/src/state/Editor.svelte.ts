import { Action, ResolutionStatus, Scenario, type IAction, type INode as Node, type IScenario } from '../../../protocol/messages.js';
import { ProcessAction } from '../../../protocol/Actions';
export { ResolutionStatus, type Node };
import { User } from 'state/User.svelte';
import { request } from 'state/Server';

let camera = $state({ x: 0, y: 0 });
let creatingNode = $state<{ x: number; y: number } | null>(null);
let editingNode = $state<{ id: string; x: number; y: number } | null>(null);
let hasLoaded = $state(false);
let id = $state<string>('');
let nodes = $state<Node[]>([]);
let origin = $state({ x: 0, y: 0 });
let socket = $state<WebSocket | null>(null);
let wire = $state<{
  node: Node;
  response: number;
  position: { x: number; y: number };
  ready: boolean;
} | null>(null);

// @dani @hack: reconnect if socket closes instead of this
const onDisconnect = (e: CloseEvent) => {
  if (e.code > 1001) {
    location.hash = '/';
  }
};

export const Editor = {
  get camera() { return camera },
  get creatingNode() { return creatingNode },
  set creatingNode(value) { creatingNode = value },
  get editingNode() { return editingNode },
  set editingNode(value) { editingNode = value },
  get hasLoaded() { return hasLoaded },
  get nodes() { return nodes },
  get origin() { return origin },
  get wire() { return wire },
  set wire(value) { wire = value },
  async create() {
    const scenario = await request({
      method: 'POST',
      endpoint: `scenario`,
      session: User.session!,
    });
    location.hash = `/${scenario}`;
  },
  async load(scenario: string) {
    this.unload();
    socket = new WebSocket(`${__SERVER__}scenario/${scenario}?auth=${User.session}`);
    socket.binaryType = 'arraybuffer';
    socket.addEventListener('close', onDisconnect);
    const onLoad = ({ data: buffer }: MessageEvent) => {
      hasLoaded = true;
      id = scenario;
      nodes = (Scenario.toObject(Scenario.decode(new Uint8Array(buffer))) as IScenario).nodes!;
      socket!.removeEventListener('message', onLoad);
      socket!.addEventListener('message', ({ data: buffer }) => {
        const action = Action.decode(new Uint8Array(buffer));
        ProcessAction(nodes, new Action(action));
      });
    };
    socket.addEventListener('message', onLoad);
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
  update(action: IAction) {
    ProcessAction(nodes, new Action(action));
    if (!socket) {
      throw new Error('Not connected!');
    }
    socket.send(Action.encode(action).finish());
  },
  unload() {
    camera = { x: 0, y: 0 };
    creatingNode = null;
    editingNode = null;
    hasLoaded = false;
    id = '';
    nodes = [];
    if (socket) {
      socket.removeEventListener('close', onDisconnect);
      socket.close();
      socket = null;
    }
    wire = null;
  },
  getWorldPosition(position: { x: number; y: number }) {
    return {
      x: position.x - origin.x - Editor.camera.x,
      y: position.y - origin.y - Editor.camera.y,
    };
  },
};

// @dani @hack
// This is here to use it through the console until I make a UI for it
(window as any).removeCurrentScenario = () => {
  Editor.remove();
};

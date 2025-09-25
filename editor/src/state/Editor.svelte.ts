import { Action, Language, Scenario, type IAction, type INode as Node, type IScenario } from '../../../protocol/messages.js';
import { ProcessAction } from '../../../protocol/Actions';
export { Language, type Node };
import { Lang } from 'state/Lang.svelte';
import { User } from 'state/User.svelte';
import { connect, request } from 'state/Server';

let camera = $state({ position: { x: 0, y: 0 }, zoom: 1 });
let creatingNode = $state<{ x: number; y: number } | null>(null);
let editingNode = $state<{ id: string; x: number; y: number } | null>(null);
let hasLoaded = $state(false);
let isLoading = $state(false);
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
  get isLoading() { return isLoading },
  get id() { return id },
  get nodes() { return nodes },
  get origin() { return origin },
  get wire() { return wire },
  set wire(value) { wire = value },
  async create() {
    const scenario = await request({
      body: { language: Language[Lang.locale.toUpperCase() as keyof typeof Language] },
      endpoint: `scenario`,
      method: 'POST',
      session: User.session!,
    });
    location.hash = `/${scenario}`;
  },
  async load(scenario: string) {
    this.unload();
    socket = connect({
      endpoint: `scenario/${scenario}`,
      session: User.session!,
    });
    socket.binaryType = 'arraybuffer';
    socket.addEventListener('close', onDisconnect);
    isLoading = true;
    const onLoad = ({ data: buffer }: MessageEvent) => {
      hasLoaded = true;
      isLoading = false;
      id = scenario;
      nodes = (Scenario.toObject(Scenario.decode(new Uint8Array(buffer)), { defaults: true }) as IScenario).nodes!;
      socket!.removeEventListener('message', onLoad);
      socket!.addEventListener('message', ({ data: buffer }) => {
        const action = Action.decode(new Uint8Array(buffer));
        ProcessAction(nodes, action);
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
  },
  async list() {
    const scenarios = await request({
      endpoint: `scenarios/user`,
      session: User.session!,
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
    camera = { position: { x: 0, y: 0 }, zoom: 1 };
    creatingNode = null;
    editingNode = null;
    hasLoaded = false;
    isLoading = false;
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
      x: (position.x - origin.x - camera.position.x) / camera.zoom,
      y: (position.y - origin.y - camera.position.y) / camera.zoom,
    };
  },
};

// @dani @hack
// This is here to use it through the console until I make a UI for it
(window as any).removeCurrentScenario = () => {
  Editor.remove();
};

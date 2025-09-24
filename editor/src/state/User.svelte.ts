import { request } from 'state/Server';

type UserData = {
  name: string;
  session: string;
};

let initial: UserData | null = null;
const key = 'texty::user';
const stored = localStorage.getItem(key) || null;
if (stored) {
  try {
    initial = JSON.parse(stored);
  } catch (e) {
    initial = null;
  }
}

let name = $state<string | null>(initial ? initial.name : null);
let session = $state<string | null>(initial ? initial.session : null);
const set = (user: UserData | null) => {
  if (user) {
    name = user.name;
    session = user.session;
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    name = null;
    session = null;
    localStorage.removeItem(key);
  }
};

if (initial) {
  request({
    endpoint: 'user',
    session: initial.session,
  })
    .then((user) => set(user))
    .catch(() => set(null));
}

export const User = {
  get name() { return name },
  get session() { return session },
  async login(name: string, password: string) {
    const user = await request({
      body: { name, password },
      endpoint: 'user',
      method: 'PUT',
    });
    set(user);
  },
  async register(name: string, password: string) {
    const user = await request({
      body: { name, password },
      endpoint: 'user',
      method: 'POST',
    });
    set(user);
  },
  async search(name: string) {
    const users = await request({
      body: { name },
      endpoint: 'users',
      method: 'POST',
      session: session!,
    });
    return users;
  },
};

import fs from 'node:fs';
import path from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  define: {
    __SERVER__: JSON.stringify(process.env.SERVER || 'http://localhost:8082/'),
  },
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  } : {},
  plugins: [
    svelte(),
  ],
  resolve: {
    alias: (
      fs.readdirSync(path.join(__dirname, 'src'), { withFileTypes: true })
        .filter((f) => f.isDirectory())
        .map(({ name }) => (
          { find: name, replacement: path.join(__dirname, 'src', name) }
        ))
    ),
  },
  server: {
    port: 8081,
  },
}));

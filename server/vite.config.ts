import fs from 'node:fs';
import path from 'node:path';
import { nodeExternals } from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.ts'],
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
  },
  plugins: [
    {
      ...nodeExternals(),
      name: 'node-externals',
      enforce: 'pre',
      apply: 'build',
    },
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
});

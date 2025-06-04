import { build } from 'esbuild';
import { glob } from 'glob';
const files = await glob('src/graphql/resolvers/**/*.ts');
console.log(files);

await build({
  sourcemap: 'inline',
  sourcesContent: false,
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  external: ['@aws-appsync/utils'],
  outdir: 'src/graphql/resolvers-compiled',
  entryPoints: files,
  bundle: true,
});

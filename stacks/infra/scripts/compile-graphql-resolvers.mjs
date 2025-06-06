import { build } from 'esbuild';
import { glob } from 'glob';
import { logger } from '@vitality-ai/utils';

const files = await glob('src/graphql/resolvers/**/*.ts');

logger.info(`Found ${files.length} files to compile: ${JSON.stringify(files)}`);

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

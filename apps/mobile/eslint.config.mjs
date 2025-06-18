import baseConfig from '../../eslint.config.mjs';

baseConfig.push({
  ignores: ['src/components/ui/**/*'],
});

export default [...baseConfig];

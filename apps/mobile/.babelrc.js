module.exports = function (api) {
  api.cache(true);

  const presets = ['nativewind/babel'];
  const plugins = ['@babel/plugin-transform-export-namespace-from'];

  if (
    process.env.NX_TASK_TARGET_TARGET === 'build' ||
    process.env.NX_TASK_TARGET_TARGET?.includes('storybook')
  ) {
    return {
      presets: [
        [
          '@nx/react/babel',
          {
            runtime: 'automatic',
          },
        ],
        ...presets,
      ],
      plugins,
    };
  }

  return {
    presets: [
      ['module:@react-native/babel-preset', { useTransformReactJSX: true }],
      ...presets,
    ],
    plugins,
  };
};

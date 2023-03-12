process.env.TAMAGUI_TARGET = 'native'

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './lib/tamagui.config.ts',
          logTimings: true,
        },
      ],
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET',
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            lib: './lib',
            components: './components',
            store: './store',
            hooks: './hooks',
          },
        },
      ],
    ],
  }
}

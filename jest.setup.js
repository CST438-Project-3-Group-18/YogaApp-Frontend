// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock @expo/vector-icons so Jest doesn't try to parse its ESM code
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = (props) =>
    React.createElement(Text, props, props.name || 'icon');

  return {
    MaterialIcons: MockIcon,
  };
});


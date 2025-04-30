module.exports = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest', 
    },
    transformIgnorePatterns: [
      "node_modules/(?!(@react-native|react-native|expo|expo-modules-core)/)" 
    ],
  };
  
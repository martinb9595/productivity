require('@rushstack/heft-node-rig/profiles/default/includes/eslint/patch/modern-module-resolution');
require('@rushstack/heft-node-rig/profiles/default/includes/eslint/patch/custom-config-package-names');

module.exports = {
  extends: [
    '@rushstack/heft-node-rig/profiles/default/includes/eslint/profile/node',
    '@rushstack/heft-node-rig/profiles/default/includes/eslint/mixins/friendly-locals',
    '@rushstack/heft-node-rig/profiles/default/includes/eslint/mixins/tsdoc'
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  plugins: ['eslint-plugin-header'],
  globals: {
    chrome: 'readonly'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'header/header': [
          'warn',
          'line',
          [
            ' Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.',
            ' See LICENSE in the project root for license information.'
          ]
        ]
      }
    }
  ]
};

const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/js/background.js',
    popup: './src/js/popup.js',
    content: './src/js/content.js'
  },
  output: {
    filename: 'background.bundle.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};

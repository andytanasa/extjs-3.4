const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const entryFiles = require('./ordered-files');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  entry: entryFiles,
  output: {
    filename: argv.mode === 'production' ? 'ext-all.js' : 'ext-all-debug.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [new TerserPlugin()],
  },
});

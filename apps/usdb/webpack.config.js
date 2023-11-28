const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

module.exports = (config, context) => {
  config = {
    ...config,
    plugins: [...config.plugins, new NodePolyfillPlugin()],
  };
  return nrwlConfig(config);
};

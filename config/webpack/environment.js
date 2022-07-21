const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

environment.plugins.prepend(
  'env',
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  })
);

module.exports = environment;

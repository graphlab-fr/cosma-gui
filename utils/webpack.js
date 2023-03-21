const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const { app } = require('electron')

/**
 * @returns {Promise<webpack.StatsCompilation>}
 */

module.exports = {
  execute: function (mode) {
    const configWebpack = { ...webpackConfig, mode };

    return new Promise((resolve, reject) => {
      webpack(configWebpack, (err, stats) => {

        if (err) {
          return reject(err);
        }
        if (!stats) {
          return reject('Err. no infos');
        }

        const info = stats.toJson();
        if (stats.hasErrors()) {
          return reject(info.errors);
        }

        resolve(info);
      });
    });
  },
  startServer: function () {
    return new Promise(async (resolve, reject) => {
      if (app.isPackaged) { resolve(); }

      const compiler = await webpack({ ...webpackConfig }),
        server = new webpackDevServer(webpackConfig.devServer, compiler);

      try {
        await server.start();
      } catch (error) {
        await server.stop();
        reject(error);
      }

      resolve(server);
    });
  },
};

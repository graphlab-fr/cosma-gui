const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    config: path.join(__dirname, "../views/config/render.jsx"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name]-bundle.js",
  },
  plugins: [
    ...["config"].map((entry) => {
      return new HtmlWebpackPlugin({
        filename: `${entry}.html`,
        template: path.join(__dirname, "../views/template.html"),
        chunks: [entry],
      });
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: [
              // need for Preact
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ya?ml$/,
        use: "yaml-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../views/"),
    },
    port: 9000,
  },
  mode: "development",
  stats: "errors-only",
};

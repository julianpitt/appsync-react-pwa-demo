const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isDevelopment = process.env.NODE_ENV !== "production";


const workboxPlugin = new WorkboxPlugin.InjectManifest({
  // these options encourage the ServiceWorkers to get in there fast
  // and not allow any straggling "old" SWs to hang around
  swSrc: "./src/service-worker.ts",
  swDest: "sw.js",
  ...(isDevelopment ? { maximumFileSizeToCacheInBytes: 31145728 } : undefined),
});

if (isDevelopment) {
  // Suppress the "InjectManifest has been called multiple times" warning by reaching into
  // the private properties of the plugin and making sure it never ends up in the state
  // where it makes that warning.
  // https://github.com/GoogleChrome/workbox/blob/v6/packages/workbox-webpack-plugin/src/inject-manifest.ts#L260-L282
  Object.defineProperty(workboxPlugin, "alreadyCalled", {
    get() {
      return false
    },
    set() {
      // do nothing; the internals try to set it to true, which then results in a warning
      // on the next run of webpack.
    },
  });
}


module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: {
    app: "./src/index.tsx",
  },
  devServer: {
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true,
    },
    allowedHosts: ['all']
  },
  target: "web",
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/'
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    new CopyPlugin({
      patterns: [
        { from: "./public/house.png", to: "./" },
        { from: "./public/manifest.json", to: "./" },
        { from: "./public/location.png", to: "./" },
        { from: "./public/notification.png", to: "./" },
      ],
    }),
    workboxPlugin,
    new webpack.optimize.ModuleConcatenationPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$|tsx/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          plugins: [
            isDevelopment && require.resolve("react-refresh/babel"),
          ].filter(Boolean),
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      },
    ],
  },
};
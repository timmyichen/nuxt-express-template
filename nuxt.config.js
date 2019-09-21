const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "universal",
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  loading: { color: "#fff" },
  css: [],
  plugins: [],
  buildModules: [],
  modules: ["bootstrap-vue/nuxt", "@nuxtjs/axios"],
  axios: {},
  dir: {
    components: "client/components",
    layouts: "client/layouts",
    pages: "client/pages",
    store: "client/store"
  },
  build: {
    extend(config, ctx) {
      let directory = ctx.isServer ? "server" : "client";
      const configFile = `${directory}/tsconfig.json`;

      const tsLoader = {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          configFile
        },
        exclude: [/vendor/, /\.nuxt/]
      };

      if (ctx.isClient) {
        tsLoader.options.appendTsSuffixTo = [/\.vue$/];
      }

      config.resolve.extensions.push(".ts");

      config.resolve.alias[directory] = ".";

      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          tsconfig: configFile
        })
      );

      if (ctx.isServer) {
        config.module.rules.push({
          test: /server\/.*\.ts$/,
          ...tsLoader
        });
      } else {
        config.module.rules.push({
          test: /client\/.*\.tsx?$/,
          ...tsLoader
        });

        config.module.rules.map(rule => {
          if (rule.loader === "vue-loader") {
            rule.options.loaders = { ts: tsLoader };
          }
          return rule;
        });
      }
    }
  }
};

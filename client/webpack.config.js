const path = require("path");
module.exports = {
    mode: "production",
    entry: {
        index: "./src/js/index.js",
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            }
        ]
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        clean: false
    },
};
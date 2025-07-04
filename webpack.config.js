const path = require("path");

module.exports = {
    entry: "./app/Main.jsx",
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "app"),
        filename: "bundled.js"
    },
    mode: "development",
    devtool: "source-map",
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, "app")
        },
        hot: true,
        liveReload: false,
        historyApiFallback: { index: "index.html" }
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]]
                    }
                }
            }
        ]
    }
};

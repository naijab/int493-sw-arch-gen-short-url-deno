module.exports = {
    apps: [
        {
            name: "url-shortener",
            script: "./index.ts",
            interpreter: "deno",
            interpreterArgs: "run --allow-net --allow-read --allow-env",
        },
    ],
};
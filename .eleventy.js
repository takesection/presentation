const crypto = require("node:crypto");
const fs = require("node:fs");
const marp = require("@marp-team/marp-cli");

module.exports = eleventyConfig => {
    eleventyConfig.addTemplateFormats("marp");
    eleventyConfig.addExtension("marp", {
        compile: async (inputContent, inputPath) => {
            const outputPath = crypto.randomUUID() + '.html';
            return marp.marpCli([ inputPath, "-o", outputPath]).then(exitCode => {
                if (exitCode !== 0) throw "Error";
                try {
                    const result = fs.readFileSync(outputPath);
                    return () => result;
                } finally {
                    fs.rmSync(outputPath);
                }
            });
        }
    });
    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
}

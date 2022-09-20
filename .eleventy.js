const marpCore = require("@marp-team/marp-core");
const marpit = require("@marp-team/marpit");
const fs = require("fs");

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy("src/script");
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addTemplateFormats("marp");
    eleventyConfig.addExtension("marp", {
        compile: async (inputContent, inputPath) => {
            const marp = new marpCore.Marp({
                container: [
                    new marpit.Element('div', { id: 'p'})
                ]
            });
            const content = fs.readFileSync(inputPath).toString();
            const result = marp.render(content);
            return async (data) => {
                data.css = result.css;
                return result.html;
            }; 
        }
    });
    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
}

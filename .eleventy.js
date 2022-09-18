const marpCore = require("@marp-team/marp-core")

module.exports = eleventyConfig => {
    /*
    eleventyConfig.addTemplateFormats("marp");
    eleventyConfig.addExtension("marp", {
        compile: async (inputContent) => {
            const marp = new marpCore.Marp({
                html: true,
                minifyCSS: true,
                script: {
                    source: 'cdn'
                }
            });
            const { html, css } = marp.render(inputContent);
            console.log(html);
            console.log(css);
            return async () => {
                return "<!DOCTYPE html>\n<html>\n<head>\n<style>" + css + "\n</style>\n</head>\n<body>\n" + html + "\n</body>\n</html>";
            };
        }
    });
    */
    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
}

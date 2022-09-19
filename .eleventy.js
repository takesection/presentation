const marpCore = require("@marp-team/marp-core");
const marpit = require("@marp-team/marpit");
const fs = require("fs");

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy("src/script");
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
                const html = "<head>\n" +
                    '<meta charset="utf-8">' +
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
                    '<title>' + data.title + '</title>' +
                    "<style>" + result.css + "</style>" +
                    "</head>\n" +
                    "<body>" + result.html + "</body>";
                return html;
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

const fs = require("fs");
const { Marp } = require("@marp-team/marp-core");
const { Element } = require("@marp-team/marpit");
const { DateTime } = require("luxon");
const { Liquid } = require("liquidjs");

module.exports = function(eleventyConfig) {
    const marp = new Marp({
        container: [
            new Element('div', { id: 'p'})
        ]
    });

    const liquid = new Liquid({}); 

    const dateFormat = (jsDate) => 
        DateTime.fromJSDate(jsDate).setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
   

    eleventyConfig.addPassthroughCopy("src/script");
    eleventyConfig.addPassthroughCopy("src/img");
    
    eleventyConfig.addTemplateFormats("marp");
    eleventyConfig.addExtension("marp", {
        compileOptions: {
            permalink: async (inputContent, inputPath) => {
                const tmpl = liquid.parse(inputContent, inputPath);
                return async (data) => {
                    return liquid.render(tmpl, data, {});
                }
            }
        },
        compile: async (inputContent, inputPath) => {
            const result = marp.render(fs.readFileSync(inputPath).toString());
            return async (data) => {
                data.css = result.css;
                return result.html;
            }; 
        }
    });

    eleventyConfig.addFilter("dateFormat", dateFormat);

    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
}

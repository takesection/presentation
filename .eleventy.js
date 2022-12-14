const fs = require("fs");
const { Marp } = require("@marp-team/marp-core");
const { Element } = require("@marp-team/marpit");
const { DateTime } = require("luxon");
const { Liquid } = require("liquidjs");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const slugify = require("slugify");
const footnotes = require("eleventy-plugin-footnotes");

module.exports = function(eleventyConfig) {
    const marp = new Marp({
        container: [
            new Element('div', { id: 'p'})
        ]
    });

    const liquid = new Liquid({}); 

    const dateFormat = (jsDate) => 
        DateTime.fromJSDate(jsDate).setLocale('en').toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
   
    const getPosts = (collection) => {
        return collection.getAll().filter(post => post.data.layout === "post").sort((a, b) => b.date - a.date);
    };

    const slug = (str) => slugify(str, {
        lower: true,
        replacement: "-",
        remove: /[*+~·,()'"`´%!?¿:@\/]/g
    });

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/script");
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/previews");
    
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
    eleventyConfig.addFilter("slug", slug);

    eleventyConfig.addCollection('posts', getPosts);

    const markdownOptions = {
        html: true,
        breaks: true,
        linkify: true
    };
    eleventyConfig.setLibrary("md", markdownIt(markdownOptions).use(markdownItFootnote));

    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(socialImages);
    eleventyConfig.addPlugin(footnotes);

    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
}

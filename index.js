const fs = require('fs');
const readFile = fs.readFile;
const writeFile = fs.writeFile;
const markdownItIframe = require('markdown-it-iframe');

var md = require('markdown-it')().use(markdownItIframe, {
    width: 976,
    height: 549,
    frameborder: 1
});

readFile('index.md', (err, data) => {
    console.log(data);
    if (err) throw err;
    writeFile('docs/index.html', md.render(data.toString()), (err) => {
        if (err) throw err;
    });
});

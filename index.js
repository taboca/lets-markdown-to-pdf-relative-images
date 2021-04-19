const path           = require('path');
const fs             = require('fs');
const markdownpdf    = require("markdown-pdf");
const through = require('through');
const cheerio = require('cheerio');

let reportFolderName = 'db';

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
  if(index == 2) reportFolderName = val;
});

// This should be where your .md file lives
let imgBasePath  = path.join(__dirname, reportFolderName);

var preProcessHtml = function() {

    return through(function(data) {
      
        var $ = cheerio.load(data);
        console.log($.html());

        $('img[src]').each(function(i, elem) {
            var path = $(this).attr('src');
            path = 'file:///'+ imgBasePath + '/' + path;
            $(this).attr('src', path);
        });
        console.log($.html());

        this.queue($.html());
    });
};


let inFile  = path.join(__dirname, reportFolderName, 'README.md');
let outFile = path.join(__dirname, reportFolderName, 'README.pdf');
 
/*
fs.createReadStream(inFile)
  .pipe(markdownpdf())
  .pipe(fs.createWriteStream(outFile))
*/
markdownpdf({preProcessHtml: preProcessHtml})
  .from(inFile)
  .to(outFile, function () { console.log("Done") })

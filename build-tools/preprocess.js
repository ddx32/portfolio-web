const through = require('through');
const cheerio = require('cheerio');
const { join } = require('path');

/* Hack up relative image paths for PDF output */
var imgBasePath = join(__dirname, '../public/');
var preProcessHtml = function() {
    return through(function(data) {
        var $ = cheerio.load(data);

        $('img[src]').each(function(i, elem) {
            var path = $(this).attr('src');
            path = imgBasePath + path;
            $(this).attr('src', path);
        });

        this.queue($.html());
    });
};

module.exports = preProcessHtml;

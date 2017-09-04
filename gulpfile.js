var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');
var mdpdf       = require('gulp-markdown-pdf');
var through     = require('through');
var cheerio     = require('cheerio');
var uglify   	= require('gulp-uglify');
var maps        = require('gulp-sourcemaps');
var concat		= require('gulp-concat');


var scripts = [
	'public/js/scrolling.js'
];

gulp.task('scripts', function(){
	gulp.src(scripts)
	.pipe(maps.init())
		.pipe(concat('site.min.js'))
		.pipe(uglify())
	.pipe(maps.write())
	.pipe(gulp.dest('./public/js/min/'));
});


/* Hack up relative image paths for PDF output */
var imgBasePath = __dirname + '/public/';
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

gulp.task('compile-pdf', function() {
    var cv = "public/_cv.md";
    return gulp.src(cv)
        .pipe(mdpdf({
            preProcessHtml: preProcessHtml,
            cssPath: 'public/css/cv-print.css'
        }))
        .pipe(gulp.dest('../static'));
});

gulp.task('serve', function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });

    gulp.watch(["public/scss/*.scss", "public/scss/*/*.scss"], function () {
        reload("main.css", {stream: true});
    });

    gulp.watch(["public/*.html", "public/*.ejs", "public/*.js", "public/*.json", "public/*.md"], function () {
        reload();
    });

    gulp.watch(["public/js/*.js"], ['scripts'], function() {
        reload();
    });

    /* PDF output generator for CV */
    gulp.watch(["public/css/cv-print.css", "public/_cv.md"], ['compile-pdf']);
  })
});


gulp.task('default', ['serve']);
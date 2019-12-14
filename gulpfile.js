const { src, dest, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const { compile } = require('harp');
const mdpdf = require('gulp-markdown-pdf');
const preProcessHtml = require('./build-tools/preprocess');

const cv = "public/_cv.md";

const copyCv = () => {
    return src(cv)
        .pipe(rename('cv.md'))
        .pipe(dest('./www/downloads'));
};

const compilePdf = () => {
    return src(cv)
        .pipe(mdpdf({
            preProcessHtml,
            cssPath: 'public/css/cv-print.css'
        }))
        .pipe(rename('cv.pdf'))
        .pipe(dest('./www/downloads'));
};

const compileSite = done => {
    return compile( __dirname, './www/', done);
};

exports['copy-cv'] = copyCv;
exports['compile-pdf'] = compilePdf;
exports['compile-site'] = compileSite;

exports.build = series(compileSite, parallel(copyCv, compilePdf));

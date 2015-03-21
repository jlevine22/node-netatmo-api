var gulp = require('gulp');
var jslint = require('gulp-jslint');
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
    return gulp.src(['index.js','./lib/*'])
        .pipe(jslint({
            indent: 4,
            es6: false,
            browser: false,
            node: true,
            nomen: true,
            predef: ['Promise']
        }));
});

gulp.task('test', function () {
    return gulp.src(['./tests/*'])
        .pipe(mocha());
});
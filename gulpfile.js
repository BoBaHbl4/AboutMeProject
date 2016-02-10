var gulp = require('gulp');
var browserSync = require("browser-sync");
var reload      = browserSync.reload;
var changedFiles = require("gulp-changed");
var less = require("gulp-less");
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

// Static Server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        startPath: "/html"
    });
});

// Styles task
// Compile *.less-files to css
// Concat and minify styles
gulp.task('styles', function(){
    gulp.src('./src_dev/css/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./build/css'))
});

gulp.task('copyHtml', function() {
    gulp.src('./src_dev/html_tmpls/*.html')
        .pipe(gulp.dest('./build/html/'))
        .pipe(reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function() {

    var client = ['copyHtml', 'styles'];

    gulp.watch('./src_dev/css/less/*.less',client);
    gulp.watch('./src_dev/html_tmpls/*.*',client);

});
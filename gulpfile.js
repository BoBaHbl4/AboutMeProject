var gulp = require('gulp');
var browserSync = require("browser-sync").create();
var changedFiles = require("gulp-changed");
var less = require("gulp-less");
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

// Server + watching files


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
        .pipe(gulp.dest('./build/html/'));
});

gulp.task('default', function() {
    gulp.run('copyHtml', 'styles');

    gulp.watch('./src_dev/css/less/*.less', function(event) {
        gulp.run('styles');
    });

    gulp.watch('./src_dev/html_tmpls/*.*', function(event) {
        gulp.run('copyHtml');
    });

});
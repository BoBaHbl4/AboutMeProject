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









/*
 This file in the main entry point for defining Gulp tasks and using Gulp plugins.
 Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
 */

//var gulp = require('gulp');
//var less = require("gulp-less");
//var minifyCSS = require('gulp-minify-css');
//var rename = require('gulp-rename');
//var inject = require('gulp-inject');
//var concat = require('gulp-concat');
//var print = require('gulp-print');
//var angularFilesort = require('gulp-angular-filesort');
//var uglify = require('gulp-uglify');
//var path = require('path');
//var util = require('gulp-util');
//var merge = require('merge-stream');
//
//// Less Task
//// Compile *.less-files to css
//// Minify styles
//gulp.task('lib-less', function () {
//    return gulp.src(['./dev_root/css/less/bootstrap/bootstrap.less', './dev_root/css/less/font-awesome/font-awesome.less'])
//        .pipe(less())
//        .pipe(minifyCSS())
//        //.pipe(rename({
//        //    suffix: ".min"
//        //}))
//        .pipe(concat('lib-styles.min.css'))
//        .pipe(gulp.dest('./dev_root/css'));
//});
//
//gulp.task('less-task', function () {
//    return gulp.src('./dev_root/css/*.less')
//        .pipe(less())
//        .pipe(less().on('error', util.log))
//        .pipe(concat('main.min.css'))
//        .pipe(minifyCSS())
//        .pipe(gulp.dest('./dev_root/css'));
//});
//
//gulp.task('css-inject', function () {
//    var target = gulp.src('./wwwroot/index.html');
//    var customCssStream = gulp.src(['./dev_root/css/lib-styles.min.css',
//        './dev_root/css/main.min.css']);
//
//    return target
//        .pipe(inject(
//            customCssStream.pipe(print())
//                .pipe(concat('common.css'))
//                .pipe(gulp.dest('./wwwroot/css')), { read: false, addRootSlash: false, relative: false })
//        )
//        .pipe(gulp.dest('./wwwroot/'));
//
//});
//
//
//
//gulp.task('default', ['lib-less'], function () {
//    console.log('Hello Gulp!');
//    gulp.watch('./dev_root/css/less/*.less', ['less-task']);
//    gulp.watch('./dev_root/css/less/*.less', ['css-inject']);
//});
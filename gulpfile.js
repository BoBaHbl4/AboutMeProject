var gulp = require('gulp');
var browserSync = require("browser-sync");
var reload      = browserSync.reload;
var less = require("gulp-less");
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var print = require('gulp-print');
var angularFilesort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var path = require('path');
var util = require('gulp-util');
var merge = require('merge-stream');

// Static Server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        startPath: "/"
    });
});

gulp.task('updateView', function() {
    gulp.src('./build/*.html')
        .pipe(reload({stream:true}));
});

// Styles tasks
//
// Compile libs *.less-files to css
// Concat and minify styles
gulp.task('lib-less', function () {
    return gulp.src(['./src_dev/css/less/bootstrap/bootstrap.less', './src_dev/css/less/font-awesome/font-awesome.less'])
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(concat('lib-styles.min.css'))
        .pipe(gulp.dest('./src_dev/css'));
});

// Compile dev *.less-files to css
// Concat and minify styles
gulp.task('less-task', function () {
    return gulp.src('./src_dev/css/less/*.less')
        .pipe(less())
        .pipe(less().on('error', util.log))
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./src_dev/css'));
});

// Compile dev and libs css-files
// Concat and injecting in build dir
gulp.task('css-inject', function () {
    var target = gulp.src('./build/index.html');
    var customCssStream = gulp.src(['./src_dev/css/lib-styles.min.css',
        './src_dev/css/main.min.css']);

    return target
        .pipe(inject(
            customCssStream.pipe(print())
                .pipe(concat('common.min.css'))
                .pipe(gulp.dest('build/css')), { read: false, addRootSlash: false, relative: true })
        )
        .pipe(gulp.dest('./build/'));
});

// Default Gulp Task
// Included libs, dev styles compile&inject and reload browsers on changes
gulp.task('default', ['browser-sync', 'lib-less', 'less-task', 'css-inject'], function() {
    console.log('Gulp started!');

    var buildUpdate = ['less-task', 'css-inject', 'updateView'];

    gulp.watch('./src_dev/css/less/*.less',buildUpdate);
    gulp.watch('./src_dev/css/less/**/*.less',buildUpdate);
    gulp.watch('./build/*.html',['updateView']);

});

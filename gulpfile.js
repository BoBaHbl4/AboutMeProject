var gulp = require('gulp');
var config = require('./gulpconfig');
var browserSync = require("browser-sync").create();
//var changedFiles = require("gulp-changed");
var less = require("gulp-less");
var path = require('path');

// Static Server + watching scss/html files
//gulp.task('browser-sync', function() {
//    browserSync.init({
//        server: {
//            baseDir: './src_dev'
//        }
//    });
//});

// Server + watching files
gulp.task('browser-sync-build', function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
});

// LESS simple task
gulp.task('less', function () {
    return gulp.src('./src_dev/css/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./build/css'));
});


gulp.task('watchChange', ['browser-sync-build'], function () {
    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("build/*.*", [browserSync.reload]);
});


gulp.task('default', function() {
    gulp.watch(config.watch.less, ['less']);
    gulp.watch(config.watch.watchChange, ['watchChange']);
});
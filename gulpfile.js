var gulp = require('gulp');
var browserSync = require("browser-sync");
var historyApiFallback = require('connect-history-api-fallback')
var reload = browserSync.reload;
var less = require("gulp-less");
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var es = require('event-stream');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var print = require('gulp-print');
var angularFilesort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var sitemap = require('gulp-sitemap');
var util = require('gulp-util');
var merge = require('merge-stream');
var del = require('del');

// Static Server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dev_root/",
            index: "/index.html",
            // routes: {
            //    "/home": "index.html"
            // },
            middleware: [ historyApiFallback() ]
        },
        startPath: "/"
    });
});

// Generates site map for search engines

gulp.task('sitemap', function () {
    gulp.src(['./dev_root/views/*.*', './dev_root/*.html'], {
        read: false
    })
        .pipe(sitemap({
            siteUrl: 'http://angular.srvrco.com/'
        }))
        .pipe(gulp.dest('./dev_root'));
});

// Updates views if css or html is changed
gulp.task('updateView', function() {
    gulp.src(['./dev_root/views/*.*', './dev_root/css/*.css'])
        .pipe(reload({stream:true}));
});

// Updates app if js is changed
gulp.task('updateScript', ['updateView', 'js-dev-inject'], function() {
    gulp.src('./dev_root/js/**/*.*')
        .pipe(reload({stream:true}));
});

// Styles tasks
//
// Compile libs *.less-files to css
// Concat and minify styles
gulp.task('lib-less', function () {
    return gulp.src([
        // TODO Before starting gulp move the proper .less libs to 'dev_root' folder
        './dev_root/css/less/bootstrap/bootstrap.less',
        './dev_root/css/less/font-awesome/font-awesome.less',
        './dev_root/css/loading-bar.css'
    ])
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(concat('lib-styles.min.css'))
        .pipe(gulp.dest('./dev_root/css'));
});

// Compile dev *.less-files to css
// Concat and minify styles
gulp.task('less-task', function () {
    return gulp.src(['./dev_root/css/*.less', './dev_root/css/less/*.less'])
        .pipe(less())
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dev_root/css'));
});

// Concat and injecting dev-css-files in build dir
gulp.task('css-inject', ['less-task'], function () {
    var target = gulp.src('./dev_root/*.html');
    var customCssStream = gulp.src([
        './dev_root/css/lib-styles.min.css',
        './dev_root/css/main.min.css'
    ]);

    return target
        .pipe(inject(
            customCssStream.pipe(print())
                .pipe(concat('common.min.css'))
                .pipe(gulp.dest('dev_root/css')), { read: false, addRootSlash: true, relative: true })
        )
        .pipe(gulp.dest('./dev_root/'))
        .pipe(reload({stream:true}));
});

gulp.task('clean:app_compiled', function () {
    return del([
        './dev_root/js/app.min.js'
        // here we use a globbing pattern to match everything inside the `mobile` folder
        //'./build/js/*.js'
        // we don't want to clean this file though so we negate the pattern
        //'!dist/mobile/deploy.json'
    ]);
});

// Compiling js-dev js and injecting in build dir
gulp.task('js-dev-inject', ['clean:app_compiled'], function () {
    var target = gulp.src('./dev_root/*.html');

    var urlConfigStream = gulp.src([
        './dev_root/js/api-url-config.js'])
        .pipe(gulp.dest('dev_root/js/'));

    var devJsStream = gulp.src([
        './dev_root/js/app.js',
        './dev_root/js/*.js',
        './dev_root/js/**/*.js',
        '!./dev_root/js/**/api-url-config.js',
        '!./dev_root/js/libs/*.js'])
    // .pipe(print())
    // .pipe(sourcemaps.init())
    // .pipe(concat('app.min.js'))
    //.pipe(ngAnnotate())
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dev_root/js/'));

    return target
        .pipe(
            inject(
                urlConfigStream,
                {name: 'urlconfig', read: false, addRootSlash: true, relative: true}))
        .pipe(
            inject(
                devJsStream,
                {name: 'dev', read: false, addRootSlash: true, relative: true}))
        .pipe(gulp.dest('./dev_root/'));
});

// Injecting js-vendor-libs in build dir
gulp.task('js-vendor-inject', function () {
    var target = gulp.src('./dev_root/*.html');
    var vendorJsStream = gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-translate/angular-translate.min.js',
        './bower_components/angular-update-meta/dist/update-meta.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-touch/angular-touch.min.js',
        './bower_components/angular-loading-bar/build/loading-bar.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'])
        .pipe(print())
        .pipe(gulp.dest('dev_root/js/libs'));

    return target
        .pipe(
            inject(
                vendorJsStream,
                {name: 'vendor', read: false, addRootSlash: true, relative: true}))
        .pipe(gulp.dest('./dev_root/'));
});

// Default Gulp Task
// Included libs, dev styles compile&inject and reload browsers on changes
gulp.task('default', [  'browser-sync',
    'lib-less',
    'less-task',
    'css-inject',
    'js-vendor-inject',
    'js-dev-inject'], function() {
    console.log('Gulp started!');

    var buildUpdate = ['lib-less', 'less-task', 'css-inject', 'updateView'];

    gulp.watch('./dev_root/css/*.less',buildUpdate);
    gulp.watch('./dev_root/css/less/*.less',buildUpdate);
    gulp.watch('./dev_root/views/*.*',['updateView']);
    gulp.watch('./dev_root/js/**/*.js',['updateScript']);

});
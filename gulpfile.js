var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var ngAnnotate = require('gulp-ng-annotate');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
    entryFile: './src/app.js',
    outputDir: './dist/',
    outputFile: 'app.js'
};

// clean the output directory
gulp.task('clean', function (cb) {
    return rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
    if (!bundler) {
        bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return bundler;
};

function bundle() {
    return getBundler()
        .transform(babelify)
        .bundle()
        .on('error', function (err) { console.log('Error: ' + err.message); })
        .pipe(source(config.outputFile))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(config.outputDir))
        .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean'], function () {
    return bundle();
});

gulp.task('copy', function () {
    gulp.src([
        './lib/github.js'
    ]).pipe(gulp.dest(config.outputDir+ 'lib'));
    gulp.src([
        './index.html'
    ]).pipe(gulp.dest(config.outputDir));
    gulp.src([
        './themes/**/*.*'
    ]).pipe(gulp.dest(config.outputDir + 'themes'));
    return true;
})

gulp.task('build', ['build-persistent', 'copy'], function () {
    return process.exit(0);
});

gulp.task('watch', ['build-persistent', 'serve'], function () {
    return getBundler().on('update', function () {
        gulp.start('build-persistent')
    });
});

gulp.task('serve', function () {
    return browserSync({
        server: {
            baseDir: './dist'
        }
    });
});
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var bourbon = require("bourbon").includePaths;
var neat = require("bourbon-neat").includePaths;
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var concat = require('gulp-concat-multi');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var normalize = require('node-normalize-scss').includePaths;
var fs = require("fs");
var runSequence = require('run-sequence');
var config = {};
var running = {
  cache: false
};

/**
 * This task generates CSS from all SCSS files and compresses them down.
 */

//Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src([
      'node_modules/bootstrap/scss/bootstrap.scss',
      './storybook/source-scss/styles/**/*.scss',
    ])
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({
      noCache: true,
      outputStyle: "compressed",
      lineNumbers: false,
      loadPath: './css/*',
      sourceMap: true,
      includePaths: [
        bourbon, 
        neat,
        normalize,
        'node_modules/breakpoint-sass/stylesheets/',
      ]
    })).on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

/**
 * This task minifies javascript in the js/js-src folder and places them in the js directory.
 */
gulp.task('js', function() {
  concat({
    'all.js': './storybook/source-js/**/*.js',
  })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./js'));
});

gulp.task('copy', function () {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/popper.js/dist/umd/popper.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
  ])
      .pipe(gulp.dest('./js/'));
});

//Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "."  
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'templates/**/*.scss'], ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default',['sass', 'js', 'copy']);

/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by viewslicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src(['views/js/**/*.js', 'views/styleguide/**/*.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function() {
  return gulp.src('views/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (views)
gulp.task('copy', function() {
  return gulp.src([
    'views/*',
    '!views/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Copy All Filescopy-workerjs At The Root Level (views)
gulp.task('copy-workerjs', function() {
  return gulp.src('views/js/jsqrcode/*.js')
    .pipe(gulp.dest('dist/js/jsqrcode/'))
    .pipe($.size({title: 'copy-workerjs'}));
});

// Copy image files from the Styleguide
gulp.task('styleguide-images', function() {
  return gulp.src('views/styleguide/**/*.{svg,png,jpg}')
    .pipe(gulp.dest('dist/styleguide/'))
    .pipe($.size({title: 'styleguide-images'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function() {
  return gulp.src(['views/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Compile and Automatically Prefix cssheets
gulp.task('css', function() {

  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'views/**/*.scss',
    'views/css/**/*.css'
  ])
    .pipe($.changed('css', {extension: '.scss'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate And Minify css
    //.pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({title: 'css'}));
});

// Concatenate And Minify JavaScript
gulp.task('js', function() {
  var sources = ['views/js/*.js',
    'views/styleguide/wskComponentHandler.js', 'views/styleguide/**/*.js'];
  return gulp.src(sources)
    //.pipe($.concat('main.js'))
     .pipe($.uglify({preserveComments: 'some'}))
    // Output Files
    .pipe(gulp.dest('dist/js'))
    .pipe($.size({title: 'js'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: '{.tmp,views}'});

  return gulp.src('views/**/**/*.html')
    .pipe(assets)
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include css your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'views/index.html',
        'views/styleguide.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: []
    })))

    // Concatenate And Minify css
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch Files For Changes & Reload
gulp.task('serve', ['css'], function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'views']
  });

  gulp.watch(['views/**/**/**/*.html'], reload);
  gulp.watch(['views/**/**/**/*.{scss,css}'], ['css', reload]);
  gulp.watch(['views/js/**/*.js','views/styleguide/**/*.js'], ['jshint']);
  gulp.watch(['views/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: "dist"
  });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function(cb) {
  runSequence('css', ['html', 'js', 'images', 'styleguide-images', 'fonts', 'copy', 'copy-workerjs'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }

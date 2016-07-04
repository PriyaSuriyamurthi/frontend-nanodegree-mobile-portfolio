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
 *  Unless required by applicable law or agreed to in writing, software
 *  optimized-portfolioributed under the License is optimized-portfolioributed on an "AS IS" BASIS,
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
  return gulp.src(['app/js/**/*.js', 'app/views/js/**/*.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src(['app/img/**/*','app/views/images/**/*'])
    .pipe(gulp.dest(['optimized-portfolio/img','optimized-portfolio/views/images']))
    .pipe($.size({title: 'img'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
  return gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/optimized-portfolio/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('optimized-portfolio'))
    .pipe($.size({title: 'copy'}));
});

// Copy All Filescopy-scripts At The Root Level (app)
gulp.task('copy-Javascript', function() {
  return gulp.src(['app/js/*.js','app/views/js/*.js'])
    .pipe(gulp.dest(['optimized-portfolio/js/','optimized-portfolio/views/js/']))
    .pipe($.size({title: 'copy-Javascripts'}));
});

// Copy image files from the img folder
gulp.task('app-img', function() {
  return gulp.src(['app/img/**/*.{svg,png,jpg}','app/views/images/**/*.{svg,png,jpg}'])
    .pipe(gulp.dest(['optimized-portfolio/img/','optimized-portfolio/views/images/']))
    .pipe($.size({title: 'app-img'}));
});

/*// Copy Web Fonts To optimized-portfolio
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('optimized-portfolio/fonts'))
    .pipe($.size({title: 'fonts'}));
});*/

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {

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
    'app/**/*.scss',
    'app/css/**/*.css',
    'app/views/css/**/*.css'
  ])
    .pipe($.changed('styles', {extension: '.scss'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('optimized-portfolio'))
    .pipe($.size({title: 'styles'}));
});

// Concatenate And Minify JavaScript
gulp.task('scripts', function() {
  var sources = ['app/scripts/*.js',
    'app/views/js/*.js', 'app/jshint/**/*.js'];
  return gulp.src(sources)
    .pipe($.concat('main.js'))
    // .pipe($.uglify({preserveComments: 'some'}))
    // Output Files
    .pipe(gulp.dest('optimized-portfolio/js','optimized-portfolio/views/js'))
    .pipe($.size({title: 'scripts'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/**/**/*.html')
    .pipe(assets)
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'app/index.html',
        'app/views/pizza.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: []
    })))

    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    .pipe(gulp.dest('optimized-portfolio'))
    .pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'optimized-portfolio/*', '!optimized-portfolio/.git'], {dot: true}));

// Watch Files For Changes & Reload
gulp.task('serve', ['styles'], function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/**/**/*.html'], reload);
  gulp.watch(['app/**/**/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/js/**/*.js','app/views/js/**/*.js'], ['jshint']);
  gulp.watch(['app/img/**/*','app/views/images/**/*'], reload);
});

// Build and serve the output from the optimized-portfolio build
gulp.task('serve:optimized-portfolio', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'optimized-portfolio',
    baseDir: "optimized-portfolio"
  });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function(cb) {
  runSequence('styles', ['html', 'js', 'img'], cb);
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

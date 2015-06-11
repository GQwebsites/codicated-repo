var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    cssminify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css');
    

 //Minifies JS
 gulp.task('minifyjs', function(){
  gulp.src('js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest("minjs"));
 }); 

//Minify Concatinated JS
gulp.task('minifyconcatjs', function(){
  gulp.src('concatjs/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest("minjs"));
 }); 

//Concat CSS
gulp.task('cssConcat', function () {
  return gulp.src('css/**/*.css')
    .pipe(concatCss("all.css"))
    .pipe(gulp.dest('concatecss/'));
});

 //SassToCSS
gulp.task('sasstocss', function(){
  return sass('scss/d-mainstyle.scss')
  .on('error', function (err) {
      console.error('Error!', err.message);
   })
  .pipe(gulp.dest('css/'))
});

//SassToCSS3
gulp.task('sasstocss3', function(){
  return sass('scss/mainconcatcss.scss')
  .on('error', function (err) {
      console.error('Error!', err.message);
   })
  .pipe(gulp.dest('css/'))
});


 //CSS AutoPrefix
 gulp.task('prefix', function () {
       return gulp.src('css/**/*.css')
        .pipe(plumber())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('css/'));
});

//Minify CSS
gulp.task('minifycss', function() {
  return gulp.src('concatecss/all.css')
  .pipe(cssminify({keepBreaks:true}))
  .pipe(gulp.dest('mincss/'));
});

//Gulp Concat
gulp.task('concatFiles', function() {
  return gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./concatjs/'));
});

//Watch Task JS
 gulp.task('watch', function(){
  gulp.watch('js/*.js', ["concatFiles"]);
 	gulp.watch('js/*.js', ["minifyjs"]);
  gulp.watch('concatjs/*.js', ["minifyconcatjs"]);
  gulp.watch('scss/**/*.scss', ["sasstocss"]);
  gulp.watch('css/**/*.css', ["prefix"]);
  gulp.watch('css/**/*.css', ["cssConcat"]);
  gulp.watch('concatecss/*.css', ["minifycss"]);
 });

gulp.task('default', ['minifyjs', 'watch']);
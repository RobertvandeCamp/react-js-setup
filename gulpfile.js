const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require("gulp-babel");
const browserSync = require('browser-sync').create();
const environments = require('gulp-environments');
const uglifycss = require('gulp-uglifycss');
const terser = require('gulp-terser');
const production = environments.production;

gulp.task('watch', () => {
  browserSync.init({proxy: 'localhost:9090',});
  gulp.watch(['src/main/resources/templates/**/*.html'], gulp.series('copy-html-and-reload'));
  gulp.watch(['src/main/resources/static/**/*.css'], gulp.series('copy-css-and-reload'));
  gulp.watch(['src/main/resources/static/js/**/*.js'], gulp.series('copy-js-and-reload'));
  gulp.watch(['src/main/resources/static/i18n/**/*.json'], gulp.series('copy-i18n-and-reload'));
});

gulp.task('copy-html', () => gulp.src(['src/main/resources/templates/**/*.html']).pipe(gulp.dest('target/classes/templates/')));
gulp.task('copy-css', () => gulp.src(['src/main/resources/static/**/*.css'])
  .pipe(production(uglifycss()))
  .pipe(gulp.dest('target/classes/static/')));
gulp.task('copy-img', () => gulp.src(['src/main/resources/static/img/**/*.*']).pipe(gulp.dest('target/classes/static/img/')));
gulp.task('copy-i18n', () => gulp.src(['src/main/resources/static/i18n/**/*.*']).pipe(gulp.dest('target/classes/static/i18n/')));
gulp.task('copy-social', () => gulp.src(['src/main/resources/static/social/**/*.*']).pipe(gulp.dest('target/classes/static/social/')));
gulp.task('copy-js-ext', () => gulp.src(['src/main/resources/static/js-ext/**/*.js']).pipe(gulp.dest('target/classes/static/js-ext/')));
gulp.task('copy-js', () => gulp.src(['src/main/resources/static/js/**/*.js'])
  // .pipe(babel())
  .pipe(production(terser()))
  .pipe(gulp.dest('target/classes/static/js/')));

gulp.task('copy-html-and-reload', gulp.series('copy-html', reload));
gulp.task('copy-css-and-reload', gulp.series('copy-css', reload));
gulp.task('copy-js-and-reload', gulp.series('copy-js', reload));
gulp.task('copy-i18n-and-reload', gulp.series('copy-i18n', reload));

gulp.task('build', gulp.series('copy-html', 'copy-css', 'copy-js', 'copy-js-ext', 'copy-img', 'copy-i18n', 'copy-social'));
gulp.task('default', gulp.series('watch'));

function reload(done) {
  browserSync.reload();
  done();
}

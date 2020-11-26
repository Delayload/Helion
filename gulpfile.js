const gulp = require('gulp');
const del = require('del');
const htmlValidator = require('gulp-w3c-html-validator');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const scss = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const server = require('browser-sync').create();
const ghPages = require('gh-pages');

function clean(cb) {
  return del('dist').then(() => {
    cb()
  })
}

function pug2html() {
  return gulp.src('src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(plumber.stop())
    .pipe(gulpif(argv.prod, htmlValidator()))
    .pipe(gulp.dest('src'))
}

function script() {
  return gulp.src('src/js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest('dist/js/'));
}

function styles() {
  return gulp.src('src/styles/styles.scss')
    .pipe(plumber())
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(scss())
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 4 version"],
      cascade: false
    }))
    .pipe(gulpif(argv.prod, cleanCSS({
      debug: true,
      compatibility: '*'
    }, details => {
      console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
    })))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulp.dest('src/css'))
}

function serve(cb) {
  server.init({
    server: 'src',
    notify: false,
    open: true,
    cors: true
  });

  gulp.watch('src/images/*/*.{gif,png,jpg,svg,webp}').on('change', server.reload);
  gulp.watch('src/styles/**/*.scss', gulp.series(styles)).on('change', server.reload);
  gulp.watch('src/js/**/*.js', gulp.series(script)).on('change', server.reload);
  gulp.watch('src/pug/**/*.pug', gulp.series(pug2html));
  gulp.watch('src/*.html').on('change', server.reload);

  return cb()
}

function buildcopy() {
  return src([
    'src/css/*',
    'src/js/*',
    'src/img/*',
    'src/fonts/*',
    'src/*.html'
  ], {base: 'src'})
    .pipe(dest('dist'))
}

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './dist'), cb);
}

const dev = gulp.parallel(pug2html, script, styles);

exports.deploy = deploy;
exports.buildcopy = buildcopy;
exports.default = gulp.series(
  clean,
  dev,
  serve
);
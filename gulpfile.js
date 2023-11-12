const gulp = require("gulp"),
      sass = require('gulp-sass')(require('sass')),
      postcss = require("gulp-postcss"),
      cleanCSS = require('gulp-clean-css'),
      autoprefixer = require("autoprefixer"),
      sourcemaps = require("gulp-sourcemaps"),
      concat = require("gulp-concat"),
      uglify = require("gulp-uglify"),
      notify = require('gulp-notify');


// Let's define the paths to our SCSS & JS files
const paths = {
    styles: {
        // Grab these .scss files
        src: "src/scss/**/*",

        // Compiled files will be saved in the root folder of our WordPress theme
        dest: "assets/style"
    },

    js: {
        src: "src/js/*",
        dest: "assets/js"
    }
};

// Process all our SCSS files, concatenate, and save to destination folder
function style() {
  return (
    gulp
    .src([paths.styles.src])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(concat("style.min.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify({ message: "CSS updated and minified! - " + Date.now(), onLast: true }))
  );
}

// Process all our JavaScript files, concatenate, and save to destination folder
function js() {
  return gulp
    .src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(notify({ message: "JavaScript file updated! - " + Date.now(), onLast: true }))
}

 // We should tell gulp which files to watch
function watch() {
  let cssWatcher = gulp.watch( [ paths.styles.src ] );
  let jsWatcher = gulp.watch( [ paths.js.src ] );

  jsWatcher.on('change', js);
  cssWatcher.on('change', style);
}

// Don't forget to expose the task!
exports.watch = watch;

// Expose the task by exporting it
// This allows you to run it from the command line using
// $ gulp style
exports.style = style;

exports.js = js;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.parallel( watch );

/*
 * You can still use `gulp.task` to expose tasks
 */
//gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task("default", build);
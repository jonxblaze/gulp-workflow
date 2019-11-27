var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    gulpCopy = require("gulp-copy"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create();

// Let's define the paths to our SCSS & JS files
var paths = {
    styles: {
        // Grab these .scss files
        src: "src/scss/*.scss",
        reset: "src/scss/resets/*.scss",

        // Compiled files will be saved in the Dist folder
        dest: "dist/assets/css"
    },

    js: {
        src: "src/js/*.js",
        dest: "dist/assets/js"
    }
};

// 
function style() {
    return (
        gulp
        .src([paths.styles.reset, paths.styles.src])
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(concat("style.min.css"))
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream())
    );
}

// Minify and Copy JS files from src folder to dist folder
function copyJs() {
    return gulp
        .src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.js.dest));
}

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./dist"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    gulp.watch(paths.styles.src, style);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website

    gulp
        .watch(["dist/*.html", paths.js.src], copyJs)
        .on("change", browserSync.reload);
}

// We don't have to expose the reload function
// It's currently only useful in other functions

// Don't forget to expose the task!
exports.watch = watch;

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, watch, copyJs);

/*
 * You can still use `gulp.task` to expose tasks
 */
//gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task("default", build);
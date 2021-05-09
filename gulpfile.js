const gulp = require("gulp");
const { parallel, series } = require("gulp");

const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create(); //https://browsersync.io/docs/gulp#page-top

// Scripts
function js(cb) {
    gulp.src("js/*js")
        .pipe(concat("superformulasvg.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
    cb();
}

// Watch Files
function watch_files() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("js/*js", js).on("change", browserSync.reload);
    gulp.watch("css/*css").on("change", browserSync.reload);
    gulp.watch("index.html").on("change", browserSync.reload);
}

// Default 'gulp' command with start local server and watch files for changes.
exports.default = series(js, watch_files);

// 'gulp build' will build all assets but not run on a local server.
exports.build = parallel(js);
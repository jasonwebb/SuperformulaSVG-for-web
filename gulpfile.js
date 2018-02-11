var gulp = require('gulp');
var concat = require('gulp-concat');            // combine multiple files into one
var sourcemaps = require('gulp-sourcemaps');    // makes minified code readable
var del = require('del');                       // deletes files/folders from file system
var uglify = require('gulp-uglify');            // minifies code

// Remove all files from dist/ folder
gulp.task('clean', function() {
    del(['./dist/*.*']);
});

// Build all JS files
gulp.task('build', function() {
    gulp.src(['./js/*.js'])
        .pipe(sourcemaps.init())                        // start capturing code for sourcemaps
            .pipe(uglify())                             // minify all code
            .pipe(concat('superformulasvg.min.js'))     // combine all minified files into one
        .pipe(sourcemaps.write())                       // end code capture and generate sourcemaps
        .pipe(gulp.dest('./dist'));                     // place minified file in dist/ folder
});

// Watch for changes to any custom JS, and kick of fresh build when found
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['clean','build']);
});

// Default task executes a fresh build of custom JS
gulp.task('default', ['clean','build']);
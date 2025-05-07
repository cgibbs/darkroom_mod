var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var fancy_log = require("fancy-log");
var watchify = require("watchify");
gulp.task("copy-scripts", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});
gulp.task('copy-index', function() {
    return gulp.src('./src/index.html').pipe(gulp.dest('./dist'));
});
gulp.task('copy-favicon', function() {
    return gulp.src('./src/favicon.ico').pipe(gulp.dest('./dist'));
});
gulp.task('copy-css', function() {
    return gulp.src('./src/css/*.css').pipe(gulp.dest('./dist/css'));
});
gulp.task('copy-libs', function() {
    return gulp.src('./src/lib/*.js').pipe(gulp.dest('./dist/lib'));
});
var watchedBrowserify = watchify(
    browserify({
        basedir: ".",
        debug: true,
        entries: ["src/script/engine.ts"],
        cache: {},
        packageCache: {},
    }).plugin(tsify)
);
function bundle() {
    return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"))
}

gulp.task('browserify', gulp.series(gulp.parallel("copy-index", "copy-css", "copy-libs", "copy-favicon"), function() {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["src/script/engine.ts"],
        cache: {},
        packageCache: {},
      })
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
}));

gulp.task('default', gulp.series(
    // 'copy-scripts',
    'copy-index',
    'copy-favicon',
    'copy-css',
    'copy-libs',
    bundle
));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
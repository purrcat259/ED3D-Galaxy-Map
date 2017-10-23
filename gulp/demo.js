import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';

let demoFile = './js/demo/demo_info.js';

let stripDirectory = (path) => {
    path.dirname = '';
};

gulp.task('build_demo', () => {
    let b = browserify(demoFile);
    return b.transform(babelify)
        .bundle()
        .pipe(source(demoFile))
        .pipe(buffer())
        .pipe(rename(stripDirectory))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

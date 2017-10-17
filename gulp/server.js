import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';

let serverFile = './server/app.babel.js';

gulp.task('build_server', () => {
  return gulp.src(serverFile)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('dist'));
});

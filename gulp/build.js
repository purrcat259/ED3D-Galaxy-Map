import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build_dist', (callback) => {
    runSequence('clean', ['build_js_dist', 'build_sass_dist', 'build_html_dist'], callback)
});

gulp.task('build', ['build_js', 'build_sass', 'build_html']);

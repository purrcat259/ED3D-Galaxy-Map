import gulp from 'gulp';
import del from 'del';

gulp.task('clean', ['clean_dist'])

gulp.task('clean_dist', () => {
    return del('dist/**');
});

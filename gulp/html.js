import gulp from 'gulp';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';

let htmlFiles = './src/html/**/*.html';

let stripDirectory = (path) => {
    path.dirname = '';
};

gulp.task('build_html', () => {
    return gulp.src('./src/html/**/*.html')
        .pipe(rename(stripDirectory))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build_html_dist', () => {
    return gulp.src(htmlFiles)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

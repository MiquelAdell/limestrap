var gulp = require('gulp');
var sass = require('gulp-sass');

var config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    distDir: './dist',
    srcDir: './src',
};

gulp.task('css', function() {
    return gulp.src(config.srcDir + '/styles/limestrap.scss')
    .pipe(sass({
        includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
    .pipe(gulp.dest(config.distDir + '/styles'));
});

gulp.task('fonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    .pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('default', ['css', 'fonts']);

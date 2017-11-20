var gulp = require('gulp');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var merge = require('gulp-merge');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');


var config = {
		bootstrapDir: './bower_components/bootstrap-sass',
		distDir: './public',
		srcDir: './source',
};

function swallowError(self, error) {
	console.log(error.toString());
	browserSync.notify(error.message, 3000); // Display error in the browser
	self.emit('end');
}

gulp.task('styles', function() {
	return runSequence('styles-generate', 'styles-minify');
});

gulp.task('styles-generate', function() {
	return gulp.src(config.srcDir + '/styles/limestrap.scss')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(sass({
		includePaths: [config.bootstrapDir + '/assets/stylesheets'],
	}))
	.pipe(gulp.dest(config.distDir + '/styles'));
});

gulp.task('styles-minify', function() {
	return gulp.src(config.distDir + '/styles/*.css')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(config.distDir + '/styles'))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return runSequence('scripts-generate', 'scripts-minify');
});

gulp.task('scripts-generate', function(){
	return gulp.src(config.srcDir + '/scripts/**.js')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(concat('limestrap.js'))
	.pipe(gulp.dest(config.distDir + '/scripts/'));
});

gulp.task('scripts-minify', function() {
	return gulp.src(config.distDir + '/scripts/*.js')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(config.distDir + '/scripts/'));
});

gulp.task('fonts', function() {
	return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('images', function(){
	return gulp.src(config.srcDir + '/images/**')
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(imagemin())
	.pipe(gulp.dest(config.distDir + '/images'));
});

gulp.task('clean', function(){
	return gulp.src(config.distDir, {read: false})
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(clean());
});

gulp.task('clean-and-main', function(){
	return runSequence('clean', 'main');
});

gulp.task('main', function(){
	return gulp.start('clean', 'styles', 'fonts', 'images', 'scripts');
});
gulp.task('default', ['clean-and-main']);

gulp.task('watch', function () {

	gulp.watch(config.srcDir + '/styles/**/**', ['styles']);
	gulp.watch(config.srcDir + '/scripts/**/**', ['scripts']);
	gulp.watch(config.srcDir + '/images/**/**', ['images']);

	var filesThatForceReload = [
		config.srcDir + '/scripts/**/**',
		config.srcDir + '/images/**/**',
		'index.html'
	];


	var browserSyncOptions = {
		proxy: "http://limesurvey.dev/templates/limestrap/index.html",
		notify: true
	};
	browserSync.init(browserSyncOptions);

	gulp.watch(filesThatForceReload).on('change', browserSync.reload);
});

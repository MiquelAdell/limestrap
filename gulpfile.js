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
	componentsDir: './node_modules',
	distDir: './public',
	srcDir: './source',
	buildDir: './build',

	browserSyncOptions: {
		proxy: "http://limesurvey.dev/templates/limestrap/index.html",
		notify: true
	}
};

config.dependencies = {
	scripts: [
		config.componentsDir + '/jquery-ui-dist/jquery-ui.min.js',
		config.componentsDir + '/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js'
	],
	styles: [
	]
};

config.filesThatForceReload = [
	config.srcDir + '/scripts/**/**',
	config.srcDir + '/images/**/**',
	'index.html'
];


function swallowError(self, error) {
	console.log(error.toString());
	browserSync.notify(error.message, 3000); // Display error in the browser
	self.emit('end');
}

gulp.task('styles', function() {

	return gulp.src([
		config.srcDir + '/styles/limestrap.scss',
	])
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: [
			config.componentsDir + '/bootstrap/scss/',
			config.componentsDir + '/awesome-bootstrap-checkbox/',
			config.componentsDir + '/bootstrap-slider/src/sass/',
			config.componentsDir + '/font-awesome/scss/'
		]
	}))
	.pipe(sourcemaps.init())

	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(config.distDir + '/styles'))
	.pipe(cleanCSS({compatibility: 'ie8'}))

	.pipe(concat('limestrap.css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('.'))

	.pipe(browserSync.stream())
	.pipe(gulp.dest(config.distDir + '/styles'));
});

gulp.task('scripts', function(){
	return gulp.src([
		config.srcDir + '/scripts/*.js',
		config.buildDir + '/*.js'
	])
	.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))
	.pipe(sourcemaps.init())
	.pipe(concat('limestrap.js'))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.distDir + '/scripts/'))
	.pipe(browserSync.stream());
});

gulp.task('fonts', function() {
	return gulp.src(
		[
			config.componentsDir + '/font-awesome/fonts/**/*'
		]
	)
	.pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('images', function(){
	return gulp.src(config.srcDir + '/images/**')
	.pipe(imagemin())
	.pipe(gulp.dest(config.distDir + '/images'));
});

gulp.task('copy-dependencies', ['clean'], function() {
	gulp.src(config.dependencies.styles)
	.pipe(gulp.dest(config.buildDir));
	gulp.src(config.dependencies.scripts)
	.pipe(gulp.dest(config.buildDir));
});

gulp.task('clean', function(){
	return gulp.src([config.distDir,config.buildDir], {read: false})
	.pipe(clean());
});

gulp.task('default', function(){
	return runSequence(
		'clean-and-copy',
		['styles', 'fonts', 'images', 'scripts']
	);
});

gulp.task('watch', function () {
	gulp.watch(config.srcDir + '/styles/**/**', ['styles']);
	gulp.watch(config.srcDir + '/scripts/**/**', ['scripts']);
	gulp.watch(config.srcDir + '/images/**/**', ['images']);

	browserSync.init(config.browserSyncOptions);

	gulp.watch(config.filesThatForceReload).on('change', browserSync.reload);
});


gulp.task('default', ['copy-dependencies'], function() {
	gulp.start(['styles','fonts', 'images', 'scripts']);
});

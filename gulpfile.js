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
var print = require('gulp-print');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var zip = require('gulp-zip');

var isProduction = (argv.production === undefined) ? false : true;

var config = {
	componentsDir: './node_modules',
	distDir: './public',
	srcDir: './source',

	browserSyncOptions: {
		proxy: "http://limesurvey.test/limestrap/",
		notify: true
	}
};

config.filesThatForceReload = [
	config.srcDir + '/scripts/**/**',
	config.srcDir + '/images/**/**',
	'index.html'
];


// function swallowError(self, error) {
// 	console.log(error.toString());
// 	browserSync.notify(error.message, 3000); // Display error in the browser
// 	self.emit('end');
// }

gulp.task('styles', function() {

	return gulp.src([
		config.srcDir + '/styles/limestrap.scss',
	])
	.pipe(print(function(filepath) {
		return "building from: " + filepath;
	}))
	.pipe(gulpif(!isProduction, sourcemaps.init()))
	.pipe(sass({
		includePaths: [
			config.componentsDir + '/bootstrap/scss/',
			config.componentsDir + '/awesome-bootstrap-checkbox/',
			config.componentsDir + '/bootstrap-slider/src/sass/'
		]
	}))

	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(config.distDir + '/styles'))
	.pipe(cleanCSS({compatibility: 'ie8'}))

	.pipe(concat('limestrap.css'))
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulpif(!isProduction, sourcemaps.write('.')))

	.pipe(gulp.dest(config.distDir + '/styles'))
	.pipe(print(function(filepath) {
		return "built: " + filepath;
	}))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function(){
	return gulp.src([
		config.srcDir + '/scripts/*.js'
	])
	.pipe(print(function(filepath) {
		return "building from: " + filepath;
	}))

	.pipe(gulpif(!isProduction, sourcemaps.init()))
	.pipe(concat('limestrap.js'))
	.pipe(gulp.dest(config.distDir + '/scripts/'))
	// .pipe(stripDebug())
	.pipe(uglify())
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulpif(!isProduction, sourcemaps.write('.')))
	.pipe(gulp.dest(config.distDir + '/scripts/'))
	.pipe(print(function(filepath) {
		return "built: " + filepath;
	}))
	.pipe(browserSync.stream());
});

gulp.task('images', function(){
	return gulp.src(config.srcDir + '/images/**')
	.pipe(imagemin())
	.pipe(gulp.dest(config.distDir + '/images'));
});

gulp.task('clean', function(){
	return gulp.src([config.distDir,'*.zip'], {read: false})
	.pipe(clean());
});

gulp.task('default', function(){
	return runSequence(
		'clean-and-copy',
		['styles', 'images', 'scripts']
	);
});

gulp.task('watch', function () {
	gulp.watch(config.srcDir + '/styles/*', ['styles']);
	gulp.watch(config.srcDir + '/scripts/**/**', ['scripts']);
	gulp.watch(config.srcDir + '/images/**/**', ['images']);

	browserSync.init(config.browserSyncOptions);

	gulp.watch(config.filesThatForceReload).on('change', browserSync.reload);
});

gulp.task('zip', function(){
	return gulp
		.src(
			[
				'**',
				'!.git/',
				'!.git/**',
				'!node_modules/',
				'!node_modules/**',
				'!source/',
				'!source/**',
				'!.*',
				'!gulpfile.js',
				'!package.json',
				'!package-lock.json',
				'!index.html',
			]
		)
		.pipe(print(function(filepath) {
			return "zipping from: " + filepath;
		}))
        .pipe(zip('esports_barcelona.zip'))
		.pipe(print(function(filepath) {
			return "zipping to: " + filepath;
		}))
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['clean'], function() {
	gulp.start(['styles','images', 'scripts']);
});

//.pipe(plumber({ errorHandler: function (error) { swallowError(this, error); } }))

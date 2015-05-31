// Load gulp plugins with 'require' function of nodejs
var gulp        = require('gulp'),
	plumber     = require('gulp-plumber'),
	gutil       = require('gulp-util'),
	uglify      = require('gulp-uglify'),
	concat      = require('gulp-concat'),
	rename      = require('gulp-rename'),
	minifyCSS   = require('gulp-minify-css'),
	sass        = require('gulp-sass'),
	path        = require('path'),
	livereload  = require('gulp-livereload'),
	browserSync = require('browser-sync');

// Handle less error
var onError = function (err) {
	gutil.beep();
	console.log(err);
};

// Path configs
var css_files  = 'assets/css/*.css', // .css files
	css_path   = 'assets/css', // .css path
	js_files   = 'assets/js/*.js', // .js files
	sass_file  = 'assets/scss/style.scss', // .scss files
	dist_path  = 'assets/dist';

//Extension config
var extension = 'html';


/***** Functions for tasks *****/
function js() {
	return gulp.src(js_files)
			.pipe(plumber({
				errorHandler: onError
			}))
			.pipe(concat('dist'))
			.pipe(rename('concat.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(dist_path))
			.pipe(livereload());
}

function css() {
	return gulp.src(css_files)
			.pipe(concat('dist'))
			.pipe(rename('all.min.css'))
			.pipe(minifyCSS({keepBreaks:true}))
			.pipe(gulp.dest(dist_path))
			.pipe(livereload());
}

function scssTask(err) {
	return gulp.src(sass_file)
			.pipe(plumber({
				errorHandler: onError
			}))
      .pipe(sass())
			.pipe(gulp.dest(css_path))
			.pipe(livereload());
}

function reloadBrowser() {
	return gulp.src('*.' + extension)
			.pipe(livereload());
}

function browserSync() {
	return browserSync({
		server: {
			baseDir: "./"
		}

		//proxy: "localhost/html-skeleton-gulp/"
	});
}

// The 'Browser Sync' task
gulp.task('browser-sync', function() {
	return browserSync();
});

// The 'js' task
gulp.task('js', function() {
	return js();
});

// The 'css' task
gulp.task('css', function(){
	return css();
});

// The 'sass' task
gulp.task('sass', function(){
	return scssTask();
});

// Reload browser when have *.html changes
gulp.task('reload-browser', function() {
	return reloadBrowser();
});

// The 'default' task.
gulp.task('default', function() {
	livereload.listen();
	//browserSync();

	browserSync({
		server: {
			baseDir: "./"
		}

		//proxy: "localhost/html-skeleton-gulp/"
	});

	gulp.watch('*.' + extension, function(){
		browserSync.reload();
	});

	gulp.watch(sass_file, function() {
		// if (err) return console.log(err);
		return scssTask();
	});

	gulp.watch(css_files, function() {
		console.log('CSS task completed!');
		browserSync.reload();
		return css();
	});

	gulp.watch(js_files, function() {
		console.log('JS task completed!');
		browserSync.reload();
		return js();
	});

	gulp.watch('*.' + extension, function(){
		console.log('Browse reloaded!');
		return reloadBrowser();
	});
});

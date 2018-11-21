var gulp = require('gulp');
var path = require("path");
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');

var srcAllFiles = path.join('src', '**', '*');
var srcAllJsFiles = path.join('src', 'assets', 'js', '*');
var dist = path.join('dist');

gulp.task('clean', function () {
	var clean = require('del');
	return clean(dist);
});

gulp.task('build', function(){
	var JS_FILTER = filter(srcAllJsFiles, {restore: true});
	return gulp.src(srcAllFiles)
		.pipe(JS_FILTER)
		.pipe(uglify())
		.pipe(JS_FILTER.restore)
		.pipe(gulp.dest(dist));
});

gulp.task('watch', function() {
	gulp.watch( srcAllFiles, { interval: 1000, usePolling: true }, ['build']);
});

gulp.task('prod', function(callback){
	return runSequence(
		'clean',
		'build',
		callback);
});

gulp.task('dev', function(callback){
	return runSequence(
		'clean',
		'build',
		'watch',
		callback);
});
